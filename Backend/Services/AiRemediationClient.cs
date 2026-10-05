using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class AiRemediationClient : IAiRemediationClient
    {
        public Task<RawRemediationPathResponse> GetRemediationPathAsync(string caseId)
        {
            var response = new RawRemediationPathResponse
            {
                CaseId = caseId,
                Steps = new List<RawRemediationStepItem>
                {
                    new RawRemediationStepItem
                    {
                        StepNumber = 1,
                        Instruction = "Sample remediation step"
                    }
                }
            };

            return Task.FromResult(response);
        }
    }
}
