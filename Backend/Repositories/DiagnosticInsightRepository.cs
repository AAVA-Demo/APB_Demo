using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticInsightRepository : IDiagnosticInsightRepository
    {
        private readonly AppDbContext _context;

        public DiagnosticInsightRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<DiagnosticInsight>> GetByCaseIdAsync(string caseId)
        {
            return _context.DiagnosticInsights
                .Where(x => x.CaseId == caseId)
                .ToListAsync();
        }
    }
}
