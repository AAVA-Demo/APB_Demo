using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class RemediationPlanResult
    {
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStep> Steps { get; set; } = new List<RemediationStep>();
        public DateTime GeneratedAtUtc { get; set; }
    }

    public class RemediationStep
    {
        public int StepOrder { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? EstimatedDurationMinutes { get; set; }
    }
}
