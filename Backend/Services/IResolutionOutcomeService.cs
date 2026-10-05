using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IResolutionOutcomeService
    {
        Task<ResolutionOutcomeDto> CreateOutcomeAsync(string issueId, string agentId, CreateResolutionOutcomeRequest request);
        Task<ResolutionOutcomeDto?> GetOutcomeAsync(string issueId);
        Task<ResolutionOutcomeDto?> UpdateOutcomeAsync(string issueId, string agentId, CreateResolutionOutcomeRequest request);
    }
}
