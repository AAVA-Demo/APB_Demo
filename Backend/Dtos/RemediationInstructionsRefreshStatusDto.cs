using System;

namespace Backend.Dtos
{
    public class RemediationInstructionsRefreshStatusDto
    {
        public string IssueId { get; set; } = string.Empty;
        public DateTime RefreshedAtUtc { get; set; }
        public int InstructionCount { get; set; }
    }
}
