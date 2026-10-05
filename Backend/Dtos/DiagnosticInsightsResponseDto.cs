using System;

namespace Backend.Dtos
{
    public class DiagnosticInsightsResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string[] Insights { get; set; } = Array.Empty<string>();
        public DateTime GeneratedAt { get; set; }
    }
}
