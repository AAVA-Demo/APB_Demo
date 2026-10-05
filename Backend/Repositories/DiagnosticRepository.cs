using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticRepository : IDiagnosticRepository
    {
        private readonly AppDbContext _context;

        public DiagnosticRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<DiagnosticRecord>> FindByMemberIdAsync(string memberId)
        {
            return _context.DiagnosticRecords.Where(d => d.MemberId == memberId).ToListAsync();
        }

        public Task<List<DiagnosticRecord>> FindByMemberIdAndIssueIdAsync(string memberId, string issueId)
        {
            return _context.DiagnosticRecords.Where(d => d.MemberId == memberId && d.IssueId == issueId).ToListAsync();
        }
    }
}
