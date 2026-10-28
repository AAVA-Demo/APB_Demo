namespace Backend.Models
{
    public class Recommendation
    {
        public string RecommendationId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContextSummary { get; set; } = string.Empty;
    }
}
