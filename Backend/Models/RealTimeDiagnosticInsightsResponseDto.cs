using System.Collections.Generic;
using Backend.Models;

namespace Backend.Dtos
{
    public class RealTimeDiagnosticInsightsResponseDto
    {
        public string InteractionId { get; set; } = string.Empty;
        public List<DiagnosticInsight> Insights { get; set; } = new List<DiagnosticInsight>();
    }
}
