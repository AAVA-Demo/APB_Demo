using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationInstructionsRepository
    {
        Task<List<RemediationInstruction>> GetInstructionsByIssueId(string issueId);
        Task SaveInstructions(string issueId, List<RemediationInstruction> instructions);
    }
}
