using System.Collections.Generic;

namespace Backend.Dtos
{
    public class DiagnosticInsightsResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public List<InsightDto> Insights { get; set; } = new List<InsightDto>();
    }
}
