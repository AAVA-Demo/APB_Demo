using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRecommendationExplanationService
    {
        Task<RecommendationExplanationDto> GetRecommendationExplanation(
            string caseId,
            string insightId,
            string recommendationId);
    }
}
