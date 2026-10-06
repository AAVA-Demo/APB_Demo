using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightConfidenceService
    {
        Task<InsightsWithConfidenceResponseDto> GetInsightsWithConfidence(string caseId);
        Task<InsightConfidenceDetailsDto> GetConfidenceDetails(string insightId);
        ConfidenceLevelResult MapScoreToLevel(double score);
    }
}
