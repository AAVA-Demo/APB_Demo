using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IAIInternalDiagnosticEngine
    {
        Task<(string RootCauseSummary, System.Collections.Generic.List<string> ContributingFactors)?> GenerateInsights(IssueContext context);
    }
}
