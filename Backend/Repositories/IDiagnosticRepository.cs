using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticRepository
    {
        Task<List<DiagnosticRecord>> FindByMemberIdAsync(string memberId);
        Task<List<DiagnosticRecord>> FindByMemberIdAndIssueIdAsync(string memberId, string issueId);
    }
}
