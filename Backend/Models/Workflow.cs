using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class Workflow
    {
        public Guid Id { get; set; }
        public string IssueId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public ICollection<WorkflowStep> Steps { get; set; } = new List<WorkflowStep>();
    }
}
