using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class NextBestActionService : INextBestActionService
    {
        private readonly IRecommendationContextService _recommendationContextService;
        private readonly IAINextBestActionEngine _aiNextBestActionEngine;

        public NextBestActionService(IRecommendationContextService recommendationContextService, IAINextBestActionEngine aiNextBestActionEngine)
        {
            _recommendationContextService = recommendationContextService;
            _aiNextBestActionEngine = aiNextBestActionEngine;
        }

        public async Task<NextBestActionPromptDto> GetPrompt(string memberIssueId, string agentId)
        {
            if (string.IsNullOrWhiteSpace(memberIssueId))
            {
                throw new NextBestActionServiceValidationException("Member issue identifier is required.");
            }

            if (string.IsNullOrWhiteSpace(agentId))
            {
                throw new NextBestActionServiceValidationException("Authenticated agent is required.");
            }

            var context = await _recommendationContextService.GetIssueContext(memberIssueId);
            if (context == null)
            {
                throw new MemberIssueNotFoundException("Member issue not found.");
            }

            var recommendation = await _aiNextBestActionEngine.GetNextBestAction(context);
            if (recommendation == null)
            {
                throw new RecommendationNotAvailableException("No recommended next action at this time.");
            }

            return new NextBestActionPromptDto
            {
                MemberIssueId = memberIssueId,
                HasRecommendation = true,
                PromptText = recommendation.PromptText,
                RecommendedStepCode = recommendation.StepCode
            };
        }
    }
}
