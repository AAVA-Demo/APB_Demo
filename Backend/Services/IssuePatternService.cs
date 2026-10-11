using System.Threading.Tasks;

namespace Backend.Services
{
    public class IssuePatternService : IIssuePatternService
    {
        public Task<string?> DetectIssuePatternAsync(string caseId)
        {
            var patternId = caseId.GetHashCode() % 2 == 0 ? "pattern-connectivity" : "pattern-performance";
            return Task.FromResult<string?>(patternId);
        }
    }
}
