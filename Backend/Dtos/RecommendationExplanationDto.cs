using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RecommendationExplanationDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public string RecommendationId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
        public List<string> Steps { get; set; } = new();
    }
}
