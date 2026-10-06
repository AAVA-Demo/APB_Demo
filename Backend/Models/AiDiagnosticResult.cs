using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class AiDiagnosticResult
    {
        public string CaseId { get; set; } = string.Empty;
        public List<DiagnosticItem> Items { get; set; } = new List<DiagnosticItem>();
        public string EngineName { get; set; } = string.Empty;
        public DateTime GeneratedAtUtc { get; set; }
    }

    public class DiagnosticItem
    {
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime LastUpdatedUtc { get; set; }
    }
}
