using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class RemediationEngineClient : IRemediationEngineClient
    {
        public List<RemediationStepDto> GetRemediationSteps(string caseId, string issueId)
        {
            return new List<RemediationStepDto>
            {
                new RemediationStepDto
                {
                    StepNumber = 1,
                    Title = "Verify member information",
                    Description = "Confirm the member details are correct."
                },
                new RemediationStepDto
                {
                    StepNumber = 2,
                    Title = "Apply recommended fix",
                    Description = "Follow the suggested remediation steps."
                }
            };
        }
    }
}
