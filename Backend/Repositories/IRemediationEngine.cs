using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationEngine
    {
        Task<IReadOnlyList<RemediationStep>> GenerateRemediationStepsAsync(string caseId);
    }
}
