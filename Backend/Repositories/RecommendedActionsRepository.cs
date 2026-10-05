using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class RecommendedActionsRepository : IRecommendedActionsRepository
    {
        public Task<List<RecommendedActionDto>> GetRecommendedActionsAsync(Guid issueId)
        {
            var actions = new List<RecommendedActionDto>
            {
                new RecommendedActionDto
                {
                    Id = Guid.NewGuid(),
                    IssueId = issueId,
                    Title = "Apply configuration patch",
                    Description = "Update configuration to recommended defaults.",
                    PriorityRank = 1,
                    ImpactScore = 0.95,
                    IsHighImpact = true
                },
                new RecommendedActionDto
                {
                    Id = Guid.NewGuid(),
                    IssueId = issueId,
                    Title = "Schedule follow-up",
                    Description = "Verify issue resolution with the member.",
                    PriorityRank = 2,
                    ImpactScore = 0.7,
                    IsHighImpact = false
                }
            };
            var ordered = actions.OrderBy(a => a.PriorityRank).ThenByDescending(a => a.ImpactScore).ToList();
            return Task.FromResult(ordered);
        }
    }
}
