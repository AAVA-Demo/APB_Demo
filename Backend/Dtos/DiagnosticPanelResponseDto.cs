using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class DiagnosticPanelResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public IssueSummaryDto IssueSummary { get; set; } = new IssueSummaryDto();
        public List<InsightDto> Insights { get; set; } = new List<InsightDto>();
        public PanelContextDto PanelContext { get; set; } = new PanelContextDto();
    }

    public class IssueSummaryDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class InsightDto
    {
        public string Id { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
    }

    public class PanelContextDto
    {
        public string SourceSystem { get; set; } = string.Empty;
        public string OpenedBy { get; set; } = string.Empty;
    }
}
