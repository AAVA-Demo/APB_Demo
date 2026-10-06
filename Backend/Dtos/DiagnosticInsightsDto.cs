using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class DiagnosticInsightsDto
    {
        public string MemberIssueId { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public string RootCauseSummary { get; set; } = string.Empty;
        public List<string> ContributingFactors { get; set; } = new List<string>();
    }
}
