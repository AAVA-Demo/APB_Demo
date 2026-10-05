using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticInsightsRepository : IDiagnosticInsightsRepository
    {
        private readonly AppDbContext _context;

        public DiagnosticInsightsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IList<InsightEntity>> GetInsightsByIssueAsync(Guid issueId)
        {
            return await _context.Insights
                .Where(i => i.IssueId == issueId && i.IsActive)
                .OrderByDescending(i => i.Priority)
                .ThenByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> IssueExistsAsync(Guid issueId)
        {
            return await _context.Insights.AnyAsync(i => i.IssueId == issueId);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
