using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class AiRecommendationClient : IAiRecommendationClient
    {
        public Task<RawRecommendationResponse> GetRecommendationsAsync(string interactionId)
        {
            var response = new RawRecommendationResponse
            {
                InteractionId = interactionId,
                Recommendations = new List<RawRecommendationItem>
                {
                    new RawRecommendationItem
                    {
                        Code = "rec-1",
                        Details = "Sample recommendation",
                        Confidence = 0.95
                    }
                }
            };

            return Task.FromResult(response);
        }
    }
}
