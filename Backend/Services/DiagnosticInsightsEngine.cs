using Backend.Dtos;
using Backend.Models;

namespace Backend.Services
{
    public class DiagnosticInsightsEngine
    {
        public List<DiagnosticInsightDto> GenerateInsights(List<DiagnosticRecord> diagnostics)
        {
            var insights = new List<DiagnosticInsightDto>();
            int index = 1;
            foreach (var record in diagnostics)
            {
                insights.Add(new DiagnosticInsightDto
                {
                    InsightId = $"insight-{index++}",
                    Summary = record.Data,
                    Severity = "MEDIUM"
                });
            }
            return insights;
        }
    }
}
