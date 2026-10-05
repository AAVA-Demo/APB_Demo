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

        public Task<List<DiagnosticInsight>> GetByInteractionIdAsync(string interactionId)
        {
            return _context.DiagnosticInsights
                .Where(d => d.InteractionId == interactionId)
                .ToListAsync();
        }
    }
}
