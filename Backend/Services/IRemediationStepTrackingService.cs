using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationStepTrackingService
    {
        Task<RemediationStepListResponse> GetRemediationStepsAsync(string issueId);
        Task<RemediationStepUpdateResponse> CompleteRemediationStepAsync(string issueId, string stepId, RemediationStepCompleteRequest request);
    }
}
