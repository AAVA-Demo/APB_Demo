using System;

namespace Backend.Models
{
    public class AiInsightCache
    {
        public string Id { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string ConfidenceLevel { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
