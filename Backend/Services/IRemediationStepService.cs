using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationStepService
    {
        RemediationStepsResponseDto GetRemediationSteps(string caseId, string issueId);
    }
}
