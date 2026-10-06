using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class Insight
    {
        public string InsightId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime LastUpdatedUtc { get; set; }
        public List<RemediationStep> RemediationSteps { get; set; } = new List<RemediationStep>();
        public double RawConfidenceScore { get; set; }
    }
}
