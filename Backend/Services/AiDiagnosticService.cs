using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class AiDiagnosticService : IAiDiagnosticService
    {
        private readonly IInteractionContextProvider _contextProvider;
        private readonly IAiEngineClient _aiEngineClient;
        private readonly IDiagnosticInsightCacheRepository _cacheRepository;

        public AiDiagnosticService(IInteractionContextProvider contextProvider, IAiEngineClient aiEngineClient, IDiagnosticInsightCacheRepository cacheRepository)
        {
            _contextProvider = contextProvider;
            _aiEngineClient = aiEngineClient;
            _cacheRepository = cacheRepository;
        }

        public async Task<RealTimeDiagnosticInsightsResponseDto> GetRealTimeDiagnosticInsights(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InteractionContextUnavailableException("InteractionId is required.");
            }

            var cached = await _cacheRepository.GetByInteractionId(interactionId);
            if (cached.Any())
            {
                return new RealTimeDiagnosticInsightsResponseDto
                {
                    InteractionId = interactionId,
                    Insights = cached.Select(c => new DiagnosticInsight
                    {
                        InsightId = c.InsightId,
                        Summary = c.Summary,
                        ProbableCause = c.ProbableCause
                    }).ToList()
                };
            }

            var context = await _contextProvider.GetInteractionContext(interactionId);
            if (string.IsNullOrWhiteSpace(context.Channel) || string.IsNullOrWhiteSpace(context.Summary))
            {
                throw new InteractionContextUnavailableException("Interaction context is incomplete for diagnostics.");
            }

            var insights = await _aiEngineClient.GetDiagnosticInsights(context);
            var dto = new RealTimeDiagnosticInsightsResponseDto
            {
                InteractionId = interactionId,
                Insights = insights
            };

            foreach (var insight in insights)
            {
                await _cacheRepository.AddAsync(new DiagnosticInsightCache
                {
                    Id = Guid.NewGuid().ToString(),
                    InteractionId = interactionId,
                    InsightId = insight.InsightId,
                    Summary = insight.Summary,
                    ProbableCause = insight.ProbableCause,
                    CreatedAt = DateTime.UtcNow
                });
            }

            return dto;
        }
    }
}
