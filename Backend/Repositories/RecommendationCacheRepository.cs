using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RecommendationCacheRepository : IRecommendationCacheRepository
    {
        private readonly AppDbContext _dbContext;

        public RecommendationCacheRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<List<RecommendationCache>> GetByInteractionId(string interactionId)
        {
            return _dbContext.RecommendationCaches
                .Where(x => x.InteractionId == interactionId)
                .ToListAsync();
        }

        public async Task AddAsync(RecommendationCache cache)
        {
            _dbContext.RecommendationCaches.Add(cache);
            await _dbContext.SaveChangesAsync();
        }
    }
}
