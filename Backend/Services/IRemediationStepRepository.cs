using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IRemediationStepRepository
    {
        Task<List<RemediationStep>> GetStepsAsync(string issuePatternId);
    }
}
