using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class CaseInsightsDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        public List<InsightDto> Insights { get; set; } = new List<InsightDto>();
        public List<InsightDto> Remediations { get; set; } = new List<InsightDto>();
    }
}
