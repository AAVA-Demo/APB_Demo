using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RecommendationSetDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public List<RecommendationDto> Recommendations { get; set; } = new List<RecommendationDto>();
    }

    public class RecommendationDto
    {
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
    }
}
