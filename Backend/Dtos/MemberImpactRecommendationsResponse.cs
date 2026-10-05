namespace Backend.Dtos
{
    public class MemberImpactRecommendationsResponse
    {
        public string MemberId { get; set; } = string.Empty;
        public List<MemberImpactRecommendationDto> Recommendations { get; set; } = new();
    }
}
