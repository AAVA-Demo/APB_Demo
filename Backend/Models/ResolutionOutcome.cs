using System;

namespace Backend.Models
{
    public class ResolutionOutcome
    {
        public Guid Id { get; set; }
        public string IssueId { get; set; } = string.Empty;
        public string Outcome { get; set; } = string.Empty;
        public string? Comments { get; set; }
        public string AgentId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
