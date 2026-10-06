using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RecommendationTemplateRepository : IRecommendationTemplateRepository
    {
        private readonly AppDbContext _context;

        public RecommendationTemplateRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<RecommendationTemplate>> GetByIssueStatusAsync(string status)
        {
            return await _context.RecommendationTemplates.Where(x => x.IssueStatus == status).ToListAsync();
        }
    }
}
