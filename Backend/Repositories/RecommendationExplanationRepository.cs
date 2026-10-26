using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RecommendationExplanationRepository : IRecommendationExplanationRepository
    {
        private readonly AppDbContext _context;

        public RecommendationExplanationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RecommendationExplanation?> GetAsync(string caseId, string insightId, string recommendationId)
        {
            var explanation = await _context.RecommendationExplanations
                .Include(x => x.Steps)
                .FirstOrDefaultAsync(x => x.CaseId == caseId &&
                                          x.InsightId == insightId &&
                                          x.RecommendationId == recommendationId);
            return explanation;
        }
    }
}
