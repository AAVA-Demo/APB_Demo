using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticPanelConfigRepository
    {
        Task<DiagnosticPanelConfig?> GetByWorkspaceIdAsync(string workspaceId);
    }
}
