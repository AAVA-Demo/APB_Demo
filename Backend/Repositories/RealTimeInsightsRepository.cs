using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RealTimeInsightsRepository : IRealTimeInsightsRepository
    {
        private readonly AppDbContext _context;

        public RealTimeInsightsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveInsights(string caseId, List<RealTimeInsight> insights)
        {
            var existing = _context.RealTimeInsights.Where(r => r.CaseId == caseId);
            _context.RealTimeInsights.RemoveRange(existing);
            await _context.RealTimeInsights.AddRangeAsync(insights);
            await _context.SaveChangesAsync();
        }

        public Task<List<RealTimeInsight>> GetInsightsByCaseId(string caseId)
        {
            return _context.RealTimeInsights.Where(r => r.CaseId == caseId).ToListAsync();
        }
    }
}
