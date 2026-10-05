using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationInstructionService
    {
        Task<RemediationInstructionResponseDto?> GetRemediationInstructionsAsync(string caseId);
    }
}
