using System.Collections.Generic;

namespace Backend.Dtos
{
    public class DiagnosticInsightListDto
    {
        public string CaseId { get; set; } = string.Empty;
        public List<DiagnosticInsightDto> Insights { get; set; } = new();
    }
}
