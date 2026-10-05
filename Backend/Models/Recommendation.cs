namespace Backend.Models
{
    public class Recommendation
    {
        public string RecommendationId { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public int Rank { get; set; }
    }
}
