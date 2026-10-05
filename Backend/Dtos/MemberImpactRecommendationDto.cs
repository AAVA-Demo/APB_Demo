namespace Backend.Dtos
{
    public class MemberImpactRecommendationDto
    {
        public string RecommendationId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ImpactScore { get; set; }
        public string ImpactLevel { get; set; } = string.Empty;
    }
}
