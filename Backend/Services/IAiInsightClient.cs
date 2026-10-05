using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class LatestInsightResponse
    {
        public string InteractionId { get; set; } = string.Empty;
        public List<InsightDto> Insights { get; set; } = new();
        public List<RecommendationDto> Recommendations { get; set; } = new();
    }

    public interface IAiInsightClient
    {
        Task<LatestInsightResponse> GetLatestInsightsAsync(string interactionId);
    }
}
