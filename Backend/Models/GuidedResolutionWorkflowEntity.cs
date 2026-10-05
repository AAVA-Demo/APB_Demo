using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class GuidedResolutionWorkflowEntity
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = "InProgress";
        public ICollection<GuidedResolutionStepEntity> Steps { get; set; } = new List<GuidedResolutionStepEntity>();
    }
}
