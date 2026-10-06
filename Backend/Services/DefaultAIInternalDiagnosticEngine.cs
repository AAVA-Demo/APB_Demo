using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class DefaultAIInternalDiagnosticEngine : IAIInternalDiagnosticEngine
    {
        public Task<(string RootCauseSummary, List<string> ContributingFactors)?> GenerateInsights(IssueContext context)
        {
            var summary = "Auto-generated root cause for issue " + context.MemberIssueId;
            var factors = new List<string> { "Factor A", "Factor B" };
            return Task.FromResult<(string, List<string>)?>((summary, factors));
        }
    }
}
