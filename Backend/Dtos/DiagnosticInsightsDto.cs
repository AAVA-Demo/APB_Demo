using System;
using System.Collections.Generic;
using Backend.Models;

namespace Backend.Dtos
{
    public class DiagnosticInsightsDto
    {
        public string CaseId { get; set; } = string.Empty;
        public IEnumerable<DiagnosticInsight> Insights { get; set; } = new List<DiagnosticInsight>();
        public DateTime GeneratedAt { get; set; }
    }
}
