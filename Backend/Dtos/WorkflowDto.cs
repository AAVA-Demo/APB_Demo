using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class WorkflowDto
    {
        public Guid Id { get; set; }
        public string IssueId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public IEnumerable<WorkflowStepDto> Steps { get; set; } = new List<WorkflowStepDto>();
        public int CurrentStepIndex { get; set; }
        public int TotalSteps { get; set; }
    }
}
