namespace Backend.Dtos
{
    public class RootCauseRecommendationResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public RootCauseRecommendationDto[] Recommendations { get; set; } = System.Array.Empty<RootCauseRecommendationDto>();
    }
}
