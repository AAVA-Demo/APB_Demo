using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class WorkflowDto
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public IList<WorkflowStepDto> Steps { get; set; } = new List<WorkflowStepDto>();
    }

    public class WorkflowStepDto
    {
        public Guid Id { get; set; }
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
    }

    public class StepCompletionRequestDto
    {
        public Guid StepId { get; set; }
        public bool IsCompleted { get; set; }
    }
}
