using System;

namespace Backend.Models
{
    public class DiagnosticInsightEvent
    {
        public string Id { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string InsightsPayload { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
    }
}
