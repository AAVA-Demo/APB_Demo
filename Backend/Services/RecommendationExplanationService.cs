using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RecommendationExplanationService : IRecommendationExplanationService
    {
        private readonly IRecommendationExplanationRepository _repository;

        public RecommendationExplanationService(IRecommendationExplanationRepository repository)
        {
            _repository = repository;
        }

        public async Task<RecommendationExplanationDto> GetRecommendationExplanation(
            string caseId,
            string insightId,
            string recommendationId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new ValidationException("CaseId is required.");
            }

            if (string.IsNullOrWhiteSpace(insightId))
            {
                throw new ValidationException("InsightId is required.");
            }

            if (string.IsNullOrWhiteSpace(recommendationId))
            {
                throw new ValidationException("RecommendationId is required.");
            }

            var entity = await _repository.GetAsync(caseId, insightId, recommendationId);
            if (entity == null)
            {
                throw new RecommendationNotFoundException();
            }

            var dto = new RecommendationExplanationDto
            {
                CaseId = entity.CaseId,
                InsightId = entity.InsightId,
                RecommendationId = entity.RecommendationId,
                Title = entity.Title,
                Explanation = entity.Explanation,
                Steps = entity.Steps
                    .OrderBy(x => x.StepOrder)
                    .Select(x => x.Description)
                    .ToList()
            };

            return dto;
        }
    }
}
