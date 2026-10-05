using System;

namespace Backend.Dtos
{
    public class DiagnosticInsightDto
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
    }
}
