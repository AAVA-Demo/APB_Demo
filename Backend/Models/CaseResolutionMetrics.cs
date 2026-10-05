using System;

namespace Backend.Models
{
    public class CaseResolutionMetrics
    {
        public string Id { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public long HandleTimeSeconds { get; set; }
        public int StepsFollowed { get; set; }
        public bool AiGuidanceUsed { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}
