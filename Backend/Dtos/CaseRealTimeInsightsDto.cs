using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class CaseRealTimeInsightsDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        public List<InsightDto> Insights { get; set; } = new List<InsightDto>();
    }
}
