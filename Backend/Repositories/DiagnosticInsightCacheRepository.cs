using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticInsightCacheRepository : IDiagnosticInsightCacheRepository
    {
        private readonly AppDbContext _dbContext;

        public DiagnosticInsightCacheRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<List<DiagnosticInsightCache>> GetByInteractionId(string interactionId)
        {
            return _dbContext.DiagnosticInsightCaches
                .Where(x => x.InteractionId == interactionId)
                .ToListAsync();
        }

        public async Task AddAsync(DiagnosticInsightCache cache)
        {
            _dbContext.DiagnosticInsightCaches.Add(cache);
            await _dbContext.SaveChangesAsync();
        }
    }
}
