using System;

namespace Backend.Models
{
    public class IssueContextSummaryCache
    {
        public string CaseId { get; set; } = string.Empty;
        public string SummaryText { get; set; } = string.Empty;
        public DateTime LastRefreshed { get; set; }
    }
}
