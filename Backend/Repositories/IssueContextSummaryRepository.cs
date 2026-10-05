using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class IssueContextSummaryRepository : IIssueContextSummaryRepository
    {
        private readonly AppDbContext _context;

        public IssueContextSummaryRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<IssueContextSummary?> GetByCaseIdAsync(string caseId)
        {
            return _context.IssueContextSummaries
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.CaseId == caseId);
        }

        public async Task SaveAsync(IssueContextSummary summary)
        {
            _context.IssueContextSummaries.Update(summary);
            await _context.SaveChangesAsync();
        }
    }
}
