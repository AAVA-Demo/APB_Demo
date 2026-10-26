using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class CurrentInsightsDto
    {
        public string CaseId { get; set; } = string.Empty;
        public DateTime LastUpdatedAt { get; set; }
        public List<InsightDto> Insights { get; set; } = new();
    }
}
