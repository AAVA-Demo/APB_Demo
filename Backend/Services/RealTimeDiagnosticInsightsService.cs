using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Channels;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RealTimeDiagnosticInsightsService : IRealTimeDiagnosticInsightsService
    {
        private readonly IMemberContextService _memberContextService;
        private readonly IRealTimeInsightsEngineClient _engineClient;
        private readonly IRealTimeInsightsRepository _repository;
        private static readonly ConcurrentDictionary<string, RealTimeInsightsResponseDto> Cache = new();

        public RealTimeDiagnosticInsightsService(IMemberContextService memberContextService, IRealTimeInsightsEngineClient engineClient, IRealTimeInsightsRepository repository)
        {
            _memberContextService = memberContextService;
            _engineClient = engineClient;
            _repository = repository;
        }

        public async Task<RealTimeInsightsAnalysisResponseDto> AnalyzeCase(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new InvalidOperationException("CaseId is required and must reference an existing member case.");
            }

            var context = await _memberContextService.GetCurrentInteractionContext(caseId);
            if (string.IsNullOrWhiteSpace(context.CurrentDataJson) || string.IsNullOrWhiteSpace(context.InteractionDataJson))
            {
                throw new InvalidOperationException("Interaction context must include current and interaction data.");
            }

            var insights = await _engineClient.GenerateRealTimeInsights(context);
            if (insights == null || !insights.Any())
            {
                throw new InvalidOperationException("No real-time diagnostic insights available for the active case.");
            }

            await _repository.SaveInsights(caseId, insights);

            var dtoInsights = insights.Select(MapInsightToDto).ToList();
            var analysisDto = new RealTimeInsightsAnalysisResponseDto
            {
                CaseId = caseId,
                MemberId = context.MemberId,
                Insights = dtoInsights
            };

            Cache[caseId] = new RealTimeInsightsResponseDto
            {
                CaseId = caseId,
                Insights = dtoInsights
            };

            return analysisDto;
        }

        public async Task<RealTimeInsightsResponseDto> GetInsights(string caseId)
        {
            if (Cache.TryGetValue(caseId, out var cached))
            {
                return cached;
            }

            var insights = await _repository.GetInsightsByCaseId(caseId);
            var dtoInsights = insights.Select(MapInsightToDto).ToList();
            var response = new RealTimeInsightsResponseDto
            {
                CaseId = caseId,
                Insights = dtoInsights
            };

            Cache[caseId] = response;
            return response;
        }

        public async IAsyncEnumerable<RealTimeInsightsResponseDto> StreamInsights(string caseId)
        {
            var channel = Channel.CreateUnbounded<RealTimeInsightsResponseDto>();

            _ = Task.Run(async () =>
            {
                var initial = await GetInsights(caseId);
                await channel.Writer.WriteAsync(initial);
                for (var i = 0; i < 3; i++)
                {
                    await Task.Delay(TimeSpan.FromSeconds(5));
                    var refreshedInsights = await _repository.GetInsightsByCaseId(caseId);
                    var dtoInsights = refreshedInsights.Select(MapInsightToDto).ToList();
                    var dto = new RealTimeInsightsResponseDto
                    {
                        CaseId = caseId,
                        Insights = dtoInsights
                    };
                    Cache[caseId] = dto;
                    await channel.Writer.WriteAsync(dto);
                }

                channel.Writer.Complete();
            });

            while (await channel.Reader.WaitToReadAsync())
            {
                while (channel.Reader.TryRead(out var item))
                {
                    yield return item;
                }
            }
        }

        private static RealTimeInsightDto MapInsightToDto(RealTimeInsight insight)
        {
            return new RealTimeInsightDto
            {
                InsightId = insight.InsightId,
                Title = insight.Title,
                Description = insight.Description,
                Severity = insight.Severity,
                CreatedAtUtc = insight.CreatedAtUtc
            };
        }
    }
}
