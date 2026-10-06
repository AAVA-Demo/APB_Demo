using System;

namespace Backend.Models
{
    public class RemediationStepStatus
    {
        public string StepId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public int StepOrder { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public string CompletedBy { get; set; } = string.Empty;
        public DateTime? CompletedAtUtc { get; set; }
    }
}
