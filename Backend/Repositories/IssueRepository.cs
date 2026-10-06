using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class IssueRepository : IIssueRepository
    {
        private readonly AppDbContext _context;

        public IssueRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveIssues(string caseId, string contextSnapshotId, List<Issue> issues)
        {
            var existingIssues = _context.Issues.Where(i => i.CaseId == caseId);
            _context.Issues.RemoveRange(existingIssues);

            var snapshot = new ContextSnapshot
            {
                ContextSnapshotId = contextSnapshotId,
                CaseId = caseId,
                CreatedAtUtc = System.DateTime.UtcNow
            };
            _context.ContextSnapshots.Add(snapshot);

            await _context.Issues.AddRangeAsync(issues);
            await _context.SaveChangesAsync();
        }

        public Task<List<Issue>> GetIssuesByCaseId(string caseId)
        {
            return _context.Issues.Where(i => i.CaseId == caseId).ToListAsync();
        }

        public async Task<string> GetLatestContextSnapshotId(string caseId)
        {
            var snapshot = await _context.ContextSnapshots.Where(s => s.CaseId == caseId).OrderByDescending(s => s.CreatedAtUtc).FirstOrDefaultAsync();
            return snapshot?.ContextSnapshotId ?? string.Empty;
        }
    }
}
