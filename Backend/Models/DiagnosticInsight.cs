using System;

namespace Backend.Models
{
    public class DiagnosticInsight
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
    }
}
