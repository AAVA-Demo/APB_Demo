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
    public class DiagnosticInsightsService : IDiagnosticInsightsService
    {
        private readonly IInsightsRepository _repository;
        private readonly IMemberContextService _memberContextService;
        private readonly IMemberEventStreamClient _memberEventStreamClient;
        private readonly IInsightsRefreshSchedulerService _schedulerService;
        private static readonly ConcurrentDictionary<string, DiagnosticInsightsResponseDto> Cache = new();

        public DiagnosticInsightsService(IInsightsRepository repository, IMemberContextService memberContextService, IMemberEventStreamClient memberEventStreamClient, IInsightsRefreshSchedulerService schedulerService)
        {
            _repository = repository;
            _memberContextService = memberContextService;
            _memberEventStreamClient = memberEventStreamClient;
            _schedulerService = schedulerService;
        }

        public async Task<DiagnosticInsightsResponseDto> GetInsights(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new InvalidOperationException("CaseId is required and must be a valid identifier.");
            }

            if (Cache.TryGetValue(caseId, out var cached))
            {
                return cached;
            }

            var insights = await _repository.GetInsightsByCaseId(caseId);
            var refreshInfo = await _repository.GetLastRefreshInfo(caseId);

            if (insights.Count == 0 || refreshInfo == null || refreshInfo.LastRefreshUtc < DateTime.UtcNow.AddSeconds(-30))
            {
                var context = await _memberContextService.GetCurrentMemberContext(caseId);
                if (string.IsNullOrWhiteSpace(context.MemberId))
                {
                    throw new InvalidOperationException("MemberId is required for insight refresh.");
                }

                var recomputedInsights = CreateSampleInsights(caseId, context.MemberId);
                await _repository.SaveInsights(caseId, recomputedInsights);
                insights = recomputedInsights;
            }

            var list = insights.Select(MapInsightToDto).ToList();
            var memberContext = await _memberContextService.GetCurrentMemberContext(caseId);
            var dto = new DiagnosticInsightsResponseDto
            {
                CaseId = caseId,
                MemberId = memberContext.MemberId,
                Insights = list
            };
            Cache[caseId] = dto;
            return dto;
        }

        public async Task<InsightsRefreshStatusDto> RefreshInsights(string caseId)
        {
            var context = await _memberContextService.GetCurrentMemberContext(caseId);
            var insights = CreateSampleInsights(caseId, context.MemberId);
            await _repository.SaveInsights(caseId, insights);

            var status = new InsightsRefreshStatusDto
            {
                CaseId = caseId,
                RefreshStatus = "Completed",
                RefreshedAtUtc = DateTime.UtcNow,
                RefreshInProgress = false
            };
            var response = await GetInsights(caseId);
            Cache[caseId] = response;
            return status;
        }

        public async Task<InsightsRefreshStatusDto> GetRefreshStatus(string caseId)
        {
            var info = await _repository.GetLastRefreshInfo(caseId);
            return new InsightsRefreshStatusDto
            {
                CaseId = caseId,
                RefreshStatus = info == null ? "Never" : "Completed",
                RefreshedAtUtc = info?.LastRefreshUtc ?? DateTime.MinValue,
                RefreshInProgress = info?.RefreshInProgress ?? false
            };
        }

        public void ValidateIssueExists(string issueId)
        {
            if (string.IsNullOrWhiteSpace(issueId))
            {
                throw new InvalidOperationException("IssueId is required and must reference an existing issue.");
            }
        }

        public async IAsyncEnumerable<DiagnosticInsightsResponseDto> StreamInsights(string caseId)
        {
            var channel = Channel.CreateUnbounded<DiagnosticInsightsResponseDto>();

            _ = Task.Run(async () =>
            {
                var initial = await GetInsights(caseId);
                await channel.Writer.WriteAsync(initial);
                for (var i = 0; i < 3; i++)
                {
                    await Task.Delay(TimeSpan.FromSeconds(5));
                    var updated = await GetInsights(caseId);
                    await channel.Writer.WriteAsync(updated);
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

        private static InsightDto MapInsightToDto(Insight insight)
        {
            var steps = insight.RemediationSteps.OrderBy(s => s.Order).Select(s => new RemediationStepDto
            {
                StepId = s.StepId,
                Order = s.Order,
                Text = s.Text
            }).ToList();

            return new InsightDto
            {
                InsightId = insight.InsightId,
                Title = insight.Title,
                Description = insight.Description,
                Confidence = insight.Confidence,
                Status = insight.Status,
                LastUpdatedUtc = insight.LastUpdatedUtc,
                RemediationSteps = steps
            };
        }

        private static List<Insight> CreateSampleInsights(string caseId, string memberId)
        {
            var insight = new Insight
            {
                InsightId = Guid.NewGuid().ToString(),
                Title = "Sample Insight",
                Description = "Sample diagnostic insight for member " + memberId,
                CaseId = caseId,
                Confidence = 0.8,
                Status = "Active",
                LastUpdatedUtc = DateTime.UtcNow,
                RemediationSteps = new List<RemediationStep>
                {
                    new RemediationStep
                    {
                        StepId = Guid.NewGuid().ToString(),
                        Order = 1,
                        Text = "Sample remediation step"
                    }
                }
            };
            return new List<Insight> { insight };
        }
    }
}
