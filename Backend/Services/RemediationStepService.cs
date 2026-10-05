using System.Collections.Generic;
using System.Linq;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationStepService : IRemediationStepService
    {
        private readonly IRemediationEngineClient _engineClient;

        public RemediationStepService(IRemediationEngineClient engineClient)
        {
            _engineClient = engineClient;
        }

        public RemediationStepsResponseDto GetRemediationSteps(string caseId, string issueId)
        {
            var steps = _engineClient.GetRemediationSteps(caseId, issueId)
                .OrderBy(s => s.StepNumber)
                .ToList();

            return new RemediationStepsResponseDto
            {
                CaseId = caseId,
                IssueId = issueId,
                Steps = steps
            };
        }
    }
}
