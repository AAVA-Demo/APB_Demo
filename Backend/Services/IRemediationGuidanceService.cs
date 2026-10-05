using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationGuidanceService
    {
        Task<RemediationStepsResponseDto> GetRemediationStepsAsync(string caseId);
        Task<RemediationStepsResponseDto> BuildRemediationStepsAsync(string caseId);
    }
}
