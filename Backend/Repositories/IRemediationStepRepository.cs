using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationStepRepository
    {
        Task<List<RemediationStep>> FindByMemberIdAndIssueIdAsync(string memberId, string issueId);
        Task<List<RemediationStep>> FindStepsByIssueIdAsync(string issueId);
        Task<RemediationStep?> UpdateStepCompletionAsync(string issueId, string stepId, string completedBy);
    }
}
