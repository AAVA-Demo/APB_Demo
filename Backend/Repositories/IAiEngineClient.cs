using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAiEngineClient
    {
        Task<AiDiagnosticResult?> GetDiagnosticsAsync(CaseData caseData);
        Task<RemediationPlanResult?> GetRemediationPlanAsync(IssueData issueData);
        Task<RecommendationResult?> GetRecommendationsAsync(CaseContext caseContext);
    }
}
