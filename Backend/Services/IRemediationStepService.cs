using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationStepService
    {
        Task<RemediationStepResponse> GetRemediationStepsAsync(string memberId, string issueId);
    }
}
