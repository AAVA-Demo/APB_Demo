using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class AiInsightService : IAiInsightService
    {
        private readonly IAiEngineClient _aiEngineClient;
        private readonly IConfidenceScoreMapper _confidenceScoreMapper;
        private readonly IAiInsightCacheRepository _cacheRepository;

        public AiInsightService(IAiEngineClient aiEngineClient, IConfidenceScoreMapper confidenceScoreMapper, IAiInsightCacheRepository cacheRepository)
        {
            _aiEngineClient = aiEngineClient;
            _confidenceScoreMapper = confidenceScoreMapper;
            _cacheRepository = cacheRepository;
        }

        public async Task<AiInsightsResponseDto> GetInsightsWithConfidence(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new AiInsightsUnavailableException("InteractionId is required.");
            }

            var cached = await _cacheRepository.GetByInteractionId(interactionId);
            if (cached.Any())
            {
                return new AiInsightsResponseDto
                {
                    InteractionId = interactionId,
                    Insights = cached.Select(c => new AiInsight
                    {
                        InsightId = c.InsightId,
                        Title = c.Title,
                        Description = c.Description,
                        ConfidenceScore = c.ConfidenceScore,
                        ConfidenceLevel = c.ConfidenceLevel
                    }).ToList()
                };
            }

            var insights = await _aiEngineClient.GetInsights(interactionId);
            foreach (var insight in insights)
            {
                if (insight.ConfidenceScore < 0.0 || insight.ConfidenceScore > 1.0)
                {
                    throw new AiInsightsUnavailableException("ConfidenceScore must be between 0.0 and 1.0.");
                }

                insight.ConfidenceLevel = _confidenceScoreMapper.MapToLevel(insight.ConfidenceScore);
            }

            var dto = new AiInsightsResponseDto
            {
                InteractionId = interactionId,
                Insights = insights.ToList()
            };

            foreach (var insight in insights)
            {
                await _cacheRepository.AddAsync(new AiInsightCache
                {
                    Id = Guid.NewGuid().ToString(),
                    InteractionId = interactionId,
                    InsightId = insight.InsightId,
                    Title = insight.Title,
                    Description = insight.Description,
                    ConfidenceScore = insight.ConfidenceScore,
                    ConfidenceLevel = insight.ConfidenceLevel,
                    CreatedAt = DateTime.UtcNow
                });
            }

            return dto;
        }
    }
}
