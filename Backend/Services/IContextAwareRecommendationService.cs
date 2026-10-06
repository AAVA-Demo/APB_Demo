using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IContextAwareRecommendationService
    {
        Task<ContextRecommendationsDto> GetRecommendations(string memberIssueId, string agentId);
    }
}
