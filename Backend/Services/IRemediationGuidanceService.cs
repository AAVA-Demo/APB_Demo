using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationGuidanceService
    {
        Task<RemediationGuidanceDto> GetGuidance(string memberIssueId, string agentId);
    }
}
