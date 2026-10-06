using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AiRecommendationResultRepository : IAiRecommendationResultRepository
    {
        private readonly AppDbContext _context;

        public AiRecommendationResultRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AiRecommendationResult>> GetByMemberIssueIdAsync(string memberIssueId)
        {
            return await _context.AiRecommendationResults.Where(x => x.MemberIssueId == memberIssueId).ToListAsync();
        }
    }
}
