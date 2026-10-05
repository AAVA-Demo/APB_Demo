using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRecommendationRankingService
    {
        Task<RankedRecommendationResponseDto> GetRankedRecommendationsAsync(string interactionId);
        Task<RankedRecommendationResponseDto> RankRecommendationsAsync(RecommendationRankRequestDto request);
    }
}
