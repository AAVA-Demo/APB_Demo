namespace Backend.Models
{
    public class RootCauseRecommendation
    {
        public string Id { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double LikelihoodScore { get; set; }
        public double ImpactScore { get; set; }
        public int PriorityRank { get; set; }
    }
}
