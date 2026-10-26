using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationExplanationRepository
    {
        Task<RecommendationExplanation?> GetAsync(string caseId, string insightId, string recommendationId);
    }
}
