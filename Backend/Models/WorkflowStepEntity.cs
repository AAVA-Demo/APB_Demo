using System;

namespace Backend.Models
{
    public class WorkflowStepEntity
    {
        public Guid Id { get; set; }
        public Guid WorkflowId { get; set; }
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
