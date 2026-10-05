using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class RawRecommendationItem
    {
        public string Code { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }

    public class RawRecommendationResponse
    {
        public string InteractionId { get; set; } = string.Empty;
        public List<RawRecommendationItem> Recommendations { get; set; } = new();
    }

    public interface IAiRecommendationClient
    {
        Task<RawRecommendationResponse> GetRecommendationsAsync(string interactionId);
    }
}
