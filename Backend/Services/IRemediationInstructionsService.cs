using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationInstructionsService
    {
        Task<RemediationInstructionsResponseDto> GetInstructions(string issueId);
        Task<RemediationInstructionsRefreshStatusDto> RefreshInstructions(string issueId);
    }
}
