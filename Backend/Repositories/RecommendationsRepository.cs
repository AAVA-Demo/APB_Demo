using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RecommendationsRepository : IRecommendationsRepository
    {
        private readonly AppDbContext _dbContext;

        public RecommendationsRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Recommendation>> GetRecommendationsAsync(Guid memberId)
        {
            return await _dbContext.Recommendations
                .Where(r => r.MemberId == memberId)
                .ToListAsync();
        }
    }
}
