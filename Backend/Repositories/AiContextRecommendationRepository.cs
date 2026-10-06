using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AiContextRecommendationRepository : IAiContextRecommendationRepository
    {
        private readonly AppDbContext _context;

        public AiContextRecommendationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AiContextRecommendation>> GetByMemberIssueIdAsync(string memberIssueId)
        {
            return await _context.AiContextRecommendations.Where(x => x.MemberIssueId == memberIssueId).ToListAsync();
        }
    }
}
