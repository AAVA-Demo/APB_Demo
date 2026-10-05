using System;
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
        private readonly AppDbContext _dbContext;

        public InsightsRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<MemberInsight>> GetInsightsForMemberAsync(Guid memberId)
        {
            return await _dbContext.MemberInsights
                .Where(i => i.MemberId == memberId)
                .OrderByDescending(i => i.GeneratedAt)
                .ToListAsync();
        }

        public async Task SaveInsightsAsync(Guid memberId, List<MemberInsight> insights)
        {
            var existing = await _dbContext.MemberInsights
                .Where(i => i.MemberId == memberId)
                .ToListAsync();

            _dbContext.MemberInsights.RemoveRange(existing);
            _dbContext.MemberInsights.AddRange(insights);
            await _dbContext.SaveChangesAsync();
        }
    }
}
