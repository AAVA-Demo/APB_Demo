using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IResolutionOutcomeRepository
    {
        Task<ResolutionOutcome?> GetByIssueAndAgentAsync(string issueId, string agentId);
        Task<ResolutionOutcome?> GetByIssueAsync(string issueId);
        Task<ResolutionOutcome> SaveAsync(ResolutionOutcome outcome);
    }
}
