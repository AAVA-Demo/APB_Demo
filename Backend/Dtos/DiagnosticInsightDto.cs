using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class DiagnosticInsightDto
    {
        public string CaseId { get; set; } = string.Empty;
        public List<DiagnosticItemDto> Insights { get; set; } = new List<DiagnosticItemDto>();
        public string GeneratedBy { get; set; } = string.Empty;
        public DateTime GeneratedAtUtc { get; set; }
    }

    public class DiagnosticItemDto
    {
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime LastUpdatedUtc { get; set; }
    }
}
