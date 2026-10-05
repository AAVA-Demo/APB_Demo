using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IAgentInsightLanguageService
    {
        Task<AgentInsightResponseDto> GetAgentFriendlyInsightsAsync(string interactionId);
        Task<AgentInsightResponseDto> TransformRawInsightsAsync(AgentInsightTransformRequestDto request);
    }
}
