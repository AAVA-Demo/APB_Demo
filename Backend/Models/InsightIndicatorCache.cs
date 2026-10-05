using System;

namespace Backend.Models
{
    public class InsightIndicatorCache
    {
        public string InsightId { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string Priority { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }
}
