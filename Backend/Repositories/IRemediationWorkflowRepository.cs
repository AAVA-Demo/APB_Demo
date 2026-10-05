using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationWorkflowRepository
    {
        Task<WorkflowEntity?> GetWorkflowByIssueAsync(Guid issueId);
        Task<IList<WorkflowStepEntity>> GetStepsByWorkflowAsync(Guid workflowId);
        Task<WorkflowStepEntity?> GetStepByIdAsync(Guid stepId);
        Task SaveAsync();
    }
}
