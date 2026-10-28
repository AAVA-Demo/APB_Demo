using System;

namespace Backend.Models
{
    public class DiagnosticInsightCache
    {
        public string Id { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string ProbableCause { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
