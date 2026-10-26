using System.Collections.Generic;

namespace Backend.Models
{
    public class RecommendationExplanation
    {
        public string CaseId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public string RecommendationId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
        public List<RecommendationStep> Steps { get; set; } = new();
    }
}
