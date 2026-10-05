using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class AIInsightsGenerator : IAIInsightsGenerator
    {
        public Task<IReadOnlyList<string>> GenerateDiagnosticInsightsAsync(string caseId)
        {
            IReadOnlyList<string> insights = new List<string>
            {
                $"Diagnostic insight for case {caseId}.",
                "Check recent changes before incident."
            };

            return Task.FromResult(insights);
        }

        public Task<IReadOnlyList<string>> GenerateContextAwareInsightsAsync(string memberId, string caseId, IReadOnlyList<MemberHistoryEvent> history)
        {
            var baseInsight = $"Context-aware insights for member {memberId} and case {caseId}.";
            var historySummary = history.Select(h => h.Summary).FirstOrDefault() ?? "No history.";
            IReadOnlyList<string> insights = new List<string>
            {
                baseInsight,
                $"Recent history summary: {historySummary}"
            };

            return Task.FromResult(insights);
        }
    }
}
