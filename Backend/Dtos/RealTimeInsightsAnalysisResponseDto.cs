using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RealTimeInsightsAnalysisResponseDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        [Required]
        public string MemberId { get; set; } = string.Empty;
        [Required]
        public List<RealTimeInsightDto> Insights { get; set; } = new List<RealTimeInsightDto>();
    }
}
