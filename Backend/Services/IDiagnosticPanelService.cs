using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticPanelService
    {
        Task<DiagnosticPanelContextDto> GetPanelContextAsync(string workspaceId, string caseId);
    }
}
