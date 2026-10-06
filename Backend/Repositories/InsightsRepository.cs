using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class InsightsRepository : IInsightsRepository
    {
        private readonly AppDbContext _context;

        public InsightsRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<Insight>> GetInsightsByCaseId(string caseId)
        {
            return _context.DiagnosticInsights.Include(i => i.RemediationSteps).Where(i => i.CaseId == caseId).ToListAsync();
        }

        public async Task SaveInsights(string caseId, List<Insight> insights)
        {
            var existing = _context.DiagnosticInsights.Where(i => i.CaseId == caseId);
            _context.DiagnosticInsights.RemoveRange(existing);
            await _context.DiagnosticInsights.AddRangeAsync(insights);

            var info = await _context.InsightsRefreshInfos.FindAsync(caseId);
            if (info == null)
            {
                info = new InsightsRefreshInfo
                {
                    CaseId = caseId,
                    LastRefreshUtc = System.DateTime.UtcNow,
                    RefreshInProgress = false
                };
                _context.InsightsRefreshInfos.Add(info);
            }
            else
            {
                info.LastRefreshUtc = System.DateTime.UtcNow;
                info.RefreshInProgress = false;
                _context.InsightsRefreshInfos.Update(info);
            }

            await _context.SaveChangesAsync();
        }

        public Task<InsightsRefreshInfo> GetLastRefreshInfo(string caseId)
        {
            return _context.InsightsRefreshInfos.FirstOrDefaultAsync(i => i.CaseId == caseId);
        }

        public Task<Insight> GetInsightById(string insightId)
        {
            return _context.DiagnosticInsights.Include(i => i.RemediationSteps).FirstAsync(i => i.InsightId == insightId);
        }
    }
}
