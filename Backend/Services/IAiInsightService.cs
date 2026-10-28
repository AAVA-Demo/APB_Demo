using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IAiInsightService
    {
        Task<AiInsightsResponseDto> GetInsightsWithConfidence(string interactionId);
    }
}
