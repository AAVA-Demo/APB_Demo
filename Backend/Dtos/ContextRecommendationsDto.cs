using System.Collections.Generic;

namespace Backend.Dtos
{
    public class ContextRecommendationsDto
    {
        public string MemberIssueId { get; set; } = string.Empty;
        public List<RecommendationDto> Recommendations { get; set; } = new List<RecommendationDto>();
    }
}
