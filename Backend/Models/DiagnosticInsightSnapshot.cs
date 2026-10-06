using System;

namespace Backend.Models
{
    public class DiagnosticInsightSnapshot
    {
        public string Id { get; set; } = string.Empty;
        public string MemberIssueId { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public string RootCauseSummary { get; set; } = string.Empty;
        public string ContributingFactorsJson { get; set; } = string.Empty;
    }
}
