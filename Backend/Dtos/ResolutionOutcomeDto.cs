using System;

namespace Backend.Dtos
{
    public class ResolutionOutcomeDto
    {
        public Guid Id { get; set; }
        public string IssueId { get; set; } = string.Empty;
        public string Outcome { get; set; } = string.Empty;
        public string? Comments { get; set; }
        public string AgentId { get; set; } = string.Empty;
        public DateTime RecordedAt { get; set; }
    }
}
