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
        private readonly AppDbContext _context;

        public RecommendationsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Recommendation>> GetRecommendationsAsync(string caseId, string memberId)
        {
            var existing = await _context.Recommendations
                .Where(r => r.CaseId == caseId && r.MemberId == memberId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            if (existing.Any())
            {
                return existing;
            }

            var rec = new Recommendation
            {
                Id = Guid.NewGuid(),
                CaseId = caseId,
                MemberId = memberId,
                Title = "Review recent activity",
                Description = "Check member history and confirm configuration.",
                Priority = 1,
                CreatedAt = DateTime.UtcNow
            };

            _context.Recommendations.Add(rec);
            await _context.SaveChangesAsync();
            return new[] { rec };
        }
    }
}
