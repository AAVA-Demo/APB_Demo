using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationStepService
    {
        Task<CaseRemediationStepsDto> GetRemediationStepsAsync(string caseId);
    }
}
