using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class RecommendationsRepository : IRecommendationsRepository
    {
        public Task<List<RecommendationDto>> GetRecommendationsAsync(Guid issueId)
        {
            var list = new List<RecommendationDto>
            {
                new RecommendationDto
                {
                    Id = Guid.NewGuid(),
                    IssueId = issueId,
                    Text = "Enable advanced monitoring for this member.",
                    ConfidenceScore = 0.88,
                    Source = "AI Engine"
                }
            };
            return Task.FromResult(list);
        }
    }
}
