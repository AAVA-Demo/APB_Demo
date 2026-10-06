using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class RemediationEngineClient : IRemediationEngineClient
    {
        public Task<List<RemediationInstruction>> GetInstructionsForIssue(string issueId)
        {
            var instructions = new List<RemediationInstruction>
            {
                new RemediationInstruction
                {
                    InstructionId = Guid.NewGuid().ToString(),
                    IssueId = issueId,
                    Order = 1,
                    Title = "Sample instruction",
                    Description = "Sample remediation instruction."
                }
            };
            return Task.FromResult(instructions);
        }
    }
}
