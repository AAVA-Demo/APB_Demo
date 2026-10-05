using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RealTimeInsightsResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public List<RealTimeInsightDto> Insights { get; set; } = new List<RealTimeInsightDto>();
    }
}
