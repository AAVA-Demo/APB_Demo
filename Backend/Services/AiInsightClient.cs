using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class AiInsightClient : IAiInsightClient
    {
        public Task<LatestInsightResponse> GetLatestInsightsAsync(string interactionId)
        {
            var response = new LatestInsightResponse
            {
                InteractionId = interactionId,
                Insights = new List<InsightDto>
                {
                    new InsightDto
                    {
                        Id = "insight-1",
                        Title = "Sample insight",
                        Description = "Sample insight description."
                    }
                },
                Recommendations = new List<RecommendationDto>
                {
                    new RecommendationDto
                    {
                        Id = "rec-1",
                        Text = "Sample recommendation."
                    }
                }
            };

            return Task.FromResult(response);
        }
    }
}
