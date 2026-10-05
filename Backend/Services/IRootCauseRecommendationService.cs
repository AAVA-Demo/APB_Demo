using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRootCauseRecommendationService
    {
        Task<RootCauseRecommendationResponseDto?> GetRootCauseRecommendationsAsync(string caseId);
    }
}
