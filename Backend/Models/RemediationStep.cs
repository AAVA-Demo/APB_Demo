using System;

namespace Backend.Models
{
    public class RemediationStep
    {
        public Guid Id { get; set; }
        public string IssueId { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
