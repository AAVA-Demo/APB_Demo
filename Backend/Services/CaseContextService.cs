using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class CaseContextService : ICaseContextService
    {
        private readonly AppDbContext _dbContext;

        public CaseContextService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CaseContext?> GetCaseContextAsync(string caseId)
        {
            var @case = await _dbContext.Cases.FirstOrDefaultAsync(c => c.CaseId == caseId);
            if (@case == null)
            {
                return null;
            }

            var contextEntity = await _dbContext.CaseContexts.FirstOrDefaultAsync(c => c.CaseId == caseId);

            return new CaseContext
            {
                CaseId = caseId,
                MemberId = @case.MemberId,
                Status = @case.Status,
                RecentInteractions = @case.RecentInteractions,
                Symptoms = contextEntity?.SymptomsJson?.Split(';').Where(s => !string.IsNullOrWhiteSpace(s)).ToList() ?? new System.Collections.Generic.List<string>(),
                RecentInteractionsList = contextEntity?.RecentInteractionsJson?.Split(';').Where(s => !string.IsNullOrWhiteSpace(s)).ToList() ?? new System.Collections.Generic.List<string>()
            };
        }

        public async Task<CaseContext?> GetCaseContextAsync(string workspaceId, string caseId)
        {
            var @case = await _dbContext.Cases.FirstOrDefaultAsync(c => c.CaseId == caseId && c.WorkspaceId == workspaceId);
            if (@case == null)
            {
                return null;
            }

            var context = await GetCaseContextAsync(caseId);
            return context;
        }
    }
}
