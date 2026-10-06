using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationStepRepository
    {
        Task<List<RemediationStepStatus>> GetStepStatusesAsync(string caseId, string issueId);
        Task<RemediationStepStatus?> GetStepStatusAsync(string caseId, string issueId, string stepId);
        Task SaveStepStatusAsync(RemediationStepStatus status);
    }
}
