using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RealTimeInsightDto
    {
        public string CaseId { get; set; } = string.Empty;
        public List<RealTimeInsightItemDto> Insights { get; set; } = new List<RealTimeInsightItemDto>();
    }

    public class RealTimeInsightItemDto
    {
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime LastUpdatedUtc { get; set; }
    }
}
