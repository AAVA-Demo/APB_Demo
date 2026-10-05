using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IWorkflowService
    {
        Task<WorkflowDto?> GetWorkflowAsync(string issueId, string agentId);
        Task<WorkflowDto?> CompleteStepAsync(string issueId, Guid stepId, string agentId, CompleteStepRequest request);
    }
}
