using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IContextAwareRecommendationService
    {
        Task<ContextAwareRecommendationsDto> GetContextAwareRecommendationsAsync(string caseId);
    }
}
