using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationWorkflowService
    {
        Task<WorkflowDto?> GetWorkflowAsync(Guid issueId);
        Task<WorkflowStepCompletionResult?> CompleteStepAsync(Guid issueId, Guid stepId, bool isCompleted);
    }

    public class WorkflowStepCompletionResult
    {
        public bool IsOrderValid { get; set; }
        public WorkflowDto? Workflow { get; set; }
    }
}
