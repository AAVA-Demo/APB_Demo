using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IRemediationEngineClient
    {
        List<RemediationStepDto> GetRemediationSteps(string caseId, string issueId);
    }
}
