using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRealTimeDiagnosticInsightsService
    {
        Task<RealTimeInsightsAnalysisResponseDto> AnalyzeCase(string caseId);
        Task<RealTimeInsightsResponseDto> GetInsights(string caseId);
        IAsyncEnumerable<RealTimeInsightsResponseDto> StreamInsights(string caseId);
    }
}
