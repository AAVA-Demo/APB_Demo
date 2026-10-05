using System;

namespace Backend.Models
{
    public class IssueContextSummary
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string SummaryText { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }
}
