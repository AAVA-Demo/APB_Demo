using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly IInteractionContextProvider _contextProvider;
        private readonly IAiEngineClient _aiEngineClient;
        private readonly IRecommendationFilter _recommendationFilter;
        private readonly IRecommendationCacheRepository _cacheRepository;

        public RecommendationService(IInteractionContextProvider contextProvider, IAiEngineClient aiEngineClient, IRecommendationFilter recommendationFilter, IRecommendationCacheRepository cacheRepository)
        {
            _contextProvider = contextProvider;
            _aiEngineClient = aiEngineClient;
            _recommendationFilter = recommendationFilter;
            _cacheRepository = cacheRepository;
        }

        public async Task<ContextAwareRecommendationsResponseDto> GetContextAwareRecommendations(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InteractionContextUnavailableException("InteractionId is required.");
            }

            var cached = await _cacheRepository.GetByInteractionId(interactionId);
            if (cached.Any())
            {
                return new ContextAwareRecommendationsResponseDto
                {
                    InteractionId = interactionId,
                    AccountId = cached.First().AccountId,
                    CaseId = cached.First().CaseId,
                    Recommendations = cached.Select(c => new Recommendation
                    {
                        RecommendationId = c.RecommendationId,
                        Title = c.Title,
                        Description = c.Description,
                        ContextSummary = c.ContextSummary
                    }).ToList()
                };
            }

            var context = await _contextProvider.GetInteractionContext(interactionId);
            var recommendations = await _aiEngineClient.GetRecommendations(context);
            var filtered = _recommendationFilter.FilterRecommendations(context, recommendations);

            var dto = new ContextAwareRecommendationsResponseDto
            {
                InteractionId = interactionId,
                AccountId = context.AccountId,
                CaseId = context.CaseId,
                Recommendations = filtered.ToList()
            };

            foreach (var rec in filtered)
            {
                await _cacheRepository.AddAsync(new RecommendationCache
                {
                    Id = Guid.NewGuid().ToString(),
                    InteractionId = interactionId,
                    AccountId = context.AccountId,
                    CaseId = context.CaseId,
                    RecommendationId = rec.RecommendationId,
                    Title = rec.Title,
                    Description = rec.Description,
                    ContextSummary = rec.ContextSummary,
                    CreatedAt = DateTime.UtcNow
                });
            }

            return dto;
        }
    }
}
