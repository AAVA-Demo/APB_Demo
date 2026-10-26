using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationStepService
    {
        Task<RemediationStepsDto> GetRemediationSteps(string caseId, string insightId);
    }
}
