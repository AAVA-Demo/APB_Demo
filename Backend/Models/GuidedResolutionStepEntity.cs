using System;

namespace Backend.Models
{
    public class GuidedResolutionStepEntity
    {
        public Guid Id { get; set; }
        public Guid WorkflowId { get; set; }
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime? CompletedAt { get; set; }
        public GuidedResolutionWorkflowEntity? Workflow { get; set; }
    }
}
