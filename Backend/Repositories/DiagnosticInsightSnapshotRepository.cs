using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticInsightSnapshotRepository : IDiagnosticInsightSnapshotRepository
    {
        private readonly AppDbContext _context;

        public DiagnosticInsightSnapshotRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DiagnosticInsightSnapshot>> GetByMemberIssueIdAsync(string memberIssueId)
        {
            return await _context.DiagnosticInsightSnapshots.Where(x => x.MemberIssueId == memberIssueId).ToListAsync();
        }

        public async Task AddAsync(DiagnosticInsightSnapshot snapshot)
        {
            _context.DiagnosticInsightSnapshots.Add(snapshot);
            await _context.SaveChangesAsync();
        }
    }
}
