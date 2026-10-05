using System;

namespace Backend.Dtos
{
    public class WorkflowStepDto
    {
        public Guid Id { get; set; }
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
    }
}
