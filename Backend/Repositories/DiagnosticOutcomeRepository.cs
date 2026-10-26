using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticOutcomeRepository : IDiagnosticOutcomeRepository
    {
        private readonly AppDbContext _context;

        public DiagnosticOutcomeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveAsync(DiagnosticOutcome outcome)
        {
            _context.DiagnosticOutcomes.Add(outcome);
            await _context.SaveChangesAsync();
        }

        public Task<bool> ExistsAsync(string caseId, string insightId)
        {
            return _context.DiagnosticOutcomes
                .AnyAsync(x => x.CaseId == caseId && x.InsightId == insightId);
        }
    }
}
