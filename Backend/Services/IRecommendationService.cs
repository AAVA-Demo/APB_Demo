using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRecommendationService
    {
        Task<ContextAwareRecommendationsResponseDto> GetContextAwareRecommendations(string interactionId);
    }
}
