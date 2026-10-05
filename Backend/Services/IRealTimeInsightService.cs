using Backend.Dtos;

namespace Backend.Services
{
    public interface IRealTimeInsightService
    {
        RealTimeInsightsResponseDto GetRealTimeInsights(string caseId);
    }
}
