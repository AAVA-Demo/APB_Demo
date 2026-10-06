using System.Collections.Generic;

namespace Backend.Dtos
{
    public class InsightsWithConfidenceResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public List<InsightWithConfidenceDto> Insights { get; set; } = new List<InsightWithConfidenceDto>();
    }
}
