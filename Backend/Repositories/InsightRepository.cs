using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class InsightRepository : IInsightRepository
    {
        private readonly AppDbContext _context;

        public InsightRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<Insight>> GetByCaseIdAsync(string caseId)
        {
            return _context.Insights
                .Where(x => x.CaseId == caseId)
                .ToListAsync();
        }

        public async Task SaveInsightsAsync(string caseId, List<Insight> insights, DateTime lastUpdatedAt)
        {
            var existing = await _context.Insights
                .Where(x => x.CaseId == caseId)
                .ToListAsync();
            _context.Insights.RemoveRange(existing);
            await _context.Insights.AddRangeAsync(insights);

            var snapshot = await _context.CaseInsightsSnapshots
                .FindAsync(caseId);
            if (snapshot == null)
            {
                snapshot = new CaseInsightsSnapshot
                {
                    CaseId = caseId,
                    LastUpdatedAt = lastUpdatedAt
                };
                await _context.CaseInsightsSnapshots.AddAsync(snapshot);
            }
            else
            {
                snapshot.LastUpdatedAt = lastUpdatedAt;
            }

            await _context.SaveChangesAsync();
        }
    }
}
