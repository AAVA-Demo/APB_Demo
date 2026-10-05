using System;

namespace Backend.Dtos
{
    public class CaseSummaryDto
    {
        public Guid CaseId { get; set; }
        public string SummaryText { get; set; } = string.Empty;
        public string? ImpactDescription { get; set; }
        public DateTime LastUpdatedUtc { get; set; }
    }
}
