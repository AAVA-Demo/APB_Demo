using System;

namespace Backend.Models
{
    public class RealTimeInsightCache
    {
        public string CaseId { get; set; } = string.Empty;
        public string Payload { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }
}
