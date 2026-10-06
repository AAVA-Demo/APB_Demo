using System;

namespace Backend.Models
{
    public class RealTimeInsight
    {
        public string InsightId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime CreatedAtUtc { get; set; }
    }
}
