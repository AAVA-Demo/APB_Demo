using Backend.Dtos;

namespace Backend.Services
{
    public interface IAgentInsightMapper
    {
        AgentInsightResponseDto ToAgentInsightResponse(RawAiInsightResponse raw);
        string ApplyLanguageSimplification(string rawText);
    }
}
