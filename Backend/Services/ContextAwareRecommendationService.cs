using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class ContextAwareRecommendationService : IContextAwareRecommendationService
    {
        private readonly IMemberContextService _memberContextService;
        private readonly IDataAnonymizationService _dataAnonymizationService;
        private readonly IAIRecommendationEngine _aiRecommendationEngine;

        public ContextAwareRecommendationService(IMemberContextService memberContextService, IDataAnonymizationService dataAnonymizationService, IAIRecommendationEngine aiRecommendationEngine)
        {
            _memberContextService = memberContextService;
            _dataAnonymizationService = dataAnonymizationService;
            _aiRecommendationEngine = aiRecommendationEngine;
        }

        public async Task<ContextRecommendationsDto> GetRecommendations(string memberIssueId, string agentId)
        {
            if (string.IsNullOrWhiteSpace(memberIssueId))
            {
                throw new ContextAwareRecommendationServiceValidationException("Member issue identifier is required.");
            }

            if (string.IsNullOrWhiteSpace(agentId))
            {
                throw new ContextAwareRecommendationServiceValidationException("Authenticated agent is required.");
            }

            var context = await _memberContextService.GetMemberContext(memberIssueId);
            if (context == null)
            {
                throw new MemberIssueNotFoundException("Member issue not found.");
            }

            var sanitized = _dataAnonymizationService.FilterSensitiveData(context);
            var recommendations = await _aiRecommendationEngine.GenerateRecommendations(sanitized);
            if (recommendations == null || recommendations.Count == 0)
            {
                throw new RecommendationsNotAvailableException("No context-aware recommendations at this time.");
            }

            var dto = new ContextRecommendationsDto
            {
                MemberIssueId = memberIssueId,
                Recommendations = new List<RecommendationDto>()
            };

            foreach (var r in recommendations)
            {
                dto.Recommendations.Add(new RecommendationDto
                {
                    RecommendationId = r.RecommendationId,
                    Title = r.Title,
                    Description = r.Description,
                    ContextSummary = r.ContextSummary
                });
            }

            return dto;
        }
    }
}
