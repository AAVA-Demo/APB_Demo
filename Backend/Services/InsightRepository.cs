using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class InsightRepository : IInsightRepository
    {
        private readonly AppDbContext _dbContext;

        public InsightRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Insight>> GetInsightsAsync(string caseId)
        {
            var @case = await _dbContext.Cases.FirstOrDefaultAsync(c => c.CaseId == caseId);
            if (@case == null)
            {
                throw new CaseNotFoundException();
            }

            var entities = await _dbContext.CaseInsights
                .Where(i => i.CaseId == caseId && i.Type == "diagnostic")
                .ToListAsync();

            return entities.Select(Map).ToList();
        }

        public async Task<List<Insight>> GetRemediationsAsync(string caseId)
        {
            var entities = await _dbContext.CaseInsights
                .Where(i => i.CaseId == caseId && i.Type == "remediation")
                .ToListAsync();

            return entities.Select(Map).ToList();
        }

        private static Insight Map(CaseInsight entity)
        {
            return new Insight
            {
                Id = entity.Id,
                Text = entity.Text,
                ConfidenceScore = entity.ConfidenceScore,
                Type = entity.Type
            };
        }
    }
}
