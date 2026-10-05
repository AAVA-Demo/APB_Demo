using System;

namespace Backend.Models
{
    public class WorkflowEntity
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
