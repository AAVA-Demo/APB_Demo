namespace Backend.Models
{
    public class AiContextRecommendation
    {
        public string Id { get; set; } = string.Empty;
        public string MemberIssueId { get; set; } = string.Empty;
        public string RecommendationTitle { get; set; } = string.Empty;
        public string RecommendationDescription { get; set; } = string.Empty;
        public string ContextSummary { get; set; } = string.Empty;
    }
}
