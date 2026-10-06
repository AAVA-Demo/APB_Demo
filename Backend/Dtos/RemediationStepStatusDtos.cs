using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationStepStatusListDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStepStatusDto> Steps { get; set; } = new List<RemediationStepStatusDto>();
    }

    public class RemediationStepStatusDto
    {
        public string StepId { get; set; } = string.Empty;
        public int StepOrder { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public string CompletedBy { get; set; } = string.Empty;
        public DateTime? CompletedAtUtc { get; set; }
    }

    public class MarkStepCompletedRequest
    {
        public string CompletedBy { get; set; } = string.Empty;
    }
}
