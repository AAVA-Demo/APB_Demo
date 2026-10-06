using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface INextBestActionService
    {
        Task<NextBestActionPromptDto> GetPrompt(string memberIssueId, string agentId);
    }
}
