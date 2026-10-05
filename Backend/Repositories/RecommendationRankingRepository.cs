using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RecommendationRankingRepository : IRecommendationRankingRepository
    {
        private readonly AppDbContext _context;

        public RecommendationRankingRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<Recommendation>> GetByInteractionIdAsync(string interactionId)
        {
            return _context.Recommendations
                .Where(r => r.InteractionId == interactionId)
                .OrderBy(r => r.Rank)
                .ToListAsync();
        }

        public async Task SaveAsync(IEnumerable<Recommendation> recommendations)
        {
            foreach (var rec in recommendations)
            {
                _context.Recommendations.Update(rec);
            }

            await _context.SaveChangesAsync();
        }
    }
}
