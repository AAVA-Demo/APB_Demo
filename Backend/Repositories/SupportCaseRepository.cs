using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class SupportCaseRepository : ISupportCaseRepository
    {
        private readonly AppDbContext _context;

        public SupportCaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<SupportCase?> GetByIdAsync(string caseId)
        {
            return _context.SupportCases.FirstOrDefaultAsync(c => c.Id == caseId);
        }

        public async Task AddDiagnosticInsightAsync(DiagnosticInsight insight)
        {
            _context.DiagnosticInsights.Add(insight);
            await _context.SaveChangesAsync();
        }

        public async Task AddDiagnosticInsightEventAsync(DiagnosticInsightEvent insightEvent)
        {
            _context.DiagnosticInsightEvents.Add(insightEvent);
            await _context.SaveChangesAsync();
        }
    }
}
