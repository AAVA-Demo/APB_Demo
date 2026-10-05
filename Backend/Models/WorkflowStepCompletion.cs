using System;

namespace Backend.Models
{
    public class WorkflowStepCompletion
    {
        public Guid Id { get; set; }
        public string IssueId { get; set; } = string.Empty;
        public Guid StepId { get; set; }
        public string AgentId { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}
