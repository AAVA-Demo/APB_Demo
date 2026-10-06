using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticPanelService
    {
        Task<DiagnosticPanelContextDto> GetPanelContext(string memberIssueId, string agentId);
    }
}
