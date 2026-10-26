using System;

namespace Backend.Dtos
{
    public class DiagnosticOutcomeDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public bool IsResolved { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string RecordedBy { get; set; } = string.Empty;
        public DateTime RecordedAt { get; set; }
;    }
}
