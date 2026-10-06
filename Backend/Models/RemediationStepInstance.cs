using System;

namespace Backend.Models
{
    public class RemediationStepInstance
    {
        public string StepInstanceId { get; set; } = string.Empty;
        public string WorkflowId { get; set; } = string.Empty;
        public string DefinitionStepId { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsRequired { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime UpdatedAtUtc { get; set; }
    }
}
