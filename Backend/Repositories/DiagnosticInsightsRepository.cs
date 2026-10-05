using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class DiagnosticInsightsRepository : IDiagnosticInsightsRepository
    {
        public Task<List<DiagnosticInsightDto>> GetCaseInsightsAsync(Guid caseId)
        {
            var insights = new List<DiagnosticInsightDto>
            {
                new DiagnosticInsightDto
                {
                    Id = Guid.NewGuid(),
                    CaseId = caseId,
                    Title = "Recent errors detected",
                    Description = "Multiple errors were logged in the last 24 hours.",
                    RelevanceScore = 0.9
                }
            };
            return Task.FromResult(insights.OrderByDescending(i => i.RelevanceScore).ToList());
        }
    }
}
