namespace Backend.Dtos
{
    public class MemberImpactIssueDto
    {
        public string IssueId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public double ImpactScore { get; set; }
        public string ImpactLevel { get; set; } = string.Empty;
        public List<MemberImpactRecommendationDto> Recommendations { get; set; } = new();
    }
}
