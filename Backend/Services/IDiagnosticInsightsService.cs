using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsService
    {
        Task<DiagnosticInsightsResponseDto> GetInsights(string caseId);
        Task<InsightsRefreshStatusDto> RefreshInsights(string caseId);
        Task<InsightsRefreshStatusDto> GetRefreshStatus(string caseId);
        void ValidateIssueExists(string issueId);
        IAsyncEnumerable<DiagnosticInsightsResponseDto> StreamInsights(string caseId);
    }
}
