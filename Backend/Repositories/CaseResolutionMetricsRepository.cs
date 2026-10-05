using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CaseResolutionMetricsRepository : ICaseResolutionMetricsRepository
    {
        private readonly AppDbContext _context;

        public CaseResolutionMetricsRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<CaseResolutionMetrics?> GetByCaseIdAsync(string caseId)
        {
            return _context.CaseResolutionMetrics.FirstOrDefaultAsync(m => m.CaseId == caseId);
        }

        public async Task AddAsync(CaseResolutionMetrics metrics)
        {
            _context.CaseResolutionMetrics.Add(metrics);
            await _context.SaveChangesAsync();
        }
    }
}
