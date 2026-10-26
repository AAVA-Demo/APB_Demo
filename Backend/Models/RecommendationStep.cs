namespace Backend.Models
{
    public class RecommendationStep
    {
        public string RecommendationId { get; set; } = string.Empty;
        public int StepOrder { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
