using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationWorkflowService
    {
        Task<RemediationWorkflowResponseDto> GetWorkflow(string caseId);
        Task<RemediationWorkflowStartResponseDto> StartWorkflow(string caseId, string issueId);
        Task<RemediationStepStatusDto> UpdateStepStatus(string caseId, string stepInstanceId, string status);
        Task<RemediationWorkflowStatusDto> GetWorkflowStatus(string caseId);
    }
}
