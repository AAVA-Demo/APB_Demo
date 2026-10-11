using System.Threading.Tasks;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class WorkspaceIntegrationService : IWorkspaceIntegrationService
    {
        private readonly AppDbContext _dbContext;

        public WorkspaceIntegrationService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> IsPanelEnabledAsync(string workspaceId)
        {
            var workspace = await _dbContext.Workspaces.FirstOrDefaultAsync(w => w.WorkspaceId == workspaceId);
            if (workspace == null)
            {
                throw new WorkspaceNotFoundException();
            }

            return workspace.PanelEnabled;
        }
    }
}
