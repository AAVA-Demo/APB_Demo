using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationStepRepository : IRemediationStepRepository
    {
        private readonly AppDbContext _context;

        public RemediationStepRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<RemediationStep>> FindByMemberIdAndIssueIdAsync(string memberId, string issueId)
        {
            return _context.RemediationSteps.Where(s => s.MemberId == memberId && s.IssueId == issueId).ToListAsync();
        }

        public Task<List<RemediationStep>> FindStepsByIssueIdAsync(string issueId)
        {
            return _context.RemediationSteps.Where(s => s.IssueId == issueId).ToListAsync();
        }

        public async Task<RemediationStep?> UpdateStepCompletionAsync(string issueId, string stepId, string completedBy)
        {
            var step = await _context.RemediationSteps.FirstOrDefaultAsync(s => s.IssueId == issueId && s.Id == stepId);
            if (step == null)
            {
                return null;
            }

            if (!step.Completed)
            {
                step.Completed = true;
                step.CompletedBy = completedBy;
                step.CompletedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return step;
        }
    }
}
