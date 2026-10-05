using System;

namespace Backend.Dtos
{
    public class RemediationStepDto
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public int StepOrder { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Category { get; set; }
    }
}
