using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class DefaultAIRecommendationEngine : IAIRecommendationEngine
    {
        public Task<List<RecommendationDtoInternal>> GenerateRecommendations(MemberContext context)
        {
            var list = new List<RecommendationDtoInternal>
            {
                new RecommendationDtoInternal
                {
                    RecommendationId = "rec-1",
                    Title = "Follow up call",
                    Description = "Schedule a follow up call with the member.",
                    ContextSummary = context.IssueHistorySummary
                }
            };
            return Task.FromResult(list);
        }
    }
}
