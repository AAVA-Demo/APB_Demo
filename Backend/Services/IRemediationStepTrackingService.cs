using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationStepTrackingService
    {
        Task<RemediationStepStatusListDto> GetRemediationStepStatusAsync(string caseId, string issueId);
        Task<RemediationStepStatusDto> MarkRemediationStepCompletedAsync(string caseId, string issueId, string stepId, string completedBy);
    }
}
