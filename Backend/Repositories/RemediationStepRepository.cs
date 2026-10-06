using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationStepRepository : IRemediationStepRepository
    {
        private readonly AppDbContext _dbContext;

        public RemediationStepRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<RemediationStepStatus>> GetStepStatusesAsync(string caseId, string issueId)
        {
            return await _dbContext.RemediationStepStatuses
                .Where(s => s.CaseId == caseId && s.IssueId == issueId)
                .OrderBy(s => s.StepOrder)
                .ToListAsync();
        }

        public async Task<RemediationStepStatus?> GetStepStatusAsync(string caseId, string issueId, string stepId)
        {
            return await _dbContext.RemediationStepStatuses
                .FirstOrDefaultAsync(s => s.CaseId == caseId && s.IssueId == issueId && s.StepId == stepId);
        }

        public async Task SaveStepStatusAsync(RemediationStepStatus status)
        {
            _dbContext.RemediationStepStatuses.Update(status);
            await _dbContext.SaveChangesAsync();
        }
    }
}
