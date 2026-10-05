using System;

namespace Backend.Models
{
    public class RemediationStep
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string RootCauseId { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
