using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticPanelConfigRepository : IDiagnosticPanelConfigRepository
    {
        private readonly AppDbContext _context;

        public DiagnosticPanelConfigRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DiagnosticPanelConfig?> GetByWorkspaceIdAsync(string workspaceId)
        {
            return await _context.DiagnosticPanelConfigs.Include(c => c.Sections).FirstOrDefaultAsync(c => c.WorkspaceId == workspaceId);
        }
    }
}
