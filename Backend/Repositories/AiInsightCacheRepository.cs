using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AiInsightCacheRepository : IAiInsightCacheRepository
    {
        private readonly AppDbContext _dbContext;

        public AiInsightCacheRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<List<AiInsightCache>> GetByInteractionId(string interactionId)
        {
            return _dbContext.AiInsightCaches
                .Where(x => x.InteractionId == interactionId)
                .ToListAsync();
        }

        public async Task AddAsync(AiInsightCache cache)
        {
            _dbContext.AiInsightCaches.Add(cache);
            await _dbContext.SaveChangesAsync();
        }
    }
}
