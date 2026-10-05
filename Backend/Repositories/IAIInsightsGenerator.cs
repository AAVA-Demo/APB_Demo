using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAIInsightsGenerator
    {
        Task<IReadOnlyList<string>> GenerateDiagnosticInsightsAsync(string caseId);
        Task<IReadOnlyList<string>> GenerateContextAwareInsightsAsync(string memberId, string caseId, IReadOnlyList<MemberHistoryEvent> history);
    }
}
