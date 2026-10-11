using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IWorkspaceIntegrationService
    {
        Task<bool> IsPanelEnabledAsync(string workspaceId);
    }
}
