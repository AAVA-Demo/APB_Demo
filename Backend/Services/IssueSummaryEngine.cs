using Backend.Models;

namespace Backend.Services
{
    public class IssueSummary
    {
        public string SummaryText { get; set; } = string.Empty;
        public string LikelyCause { get; set; } = string.Empty;
    }

    public class IssueSummaryEngine
    {
        public IssueSummary GenerateSummary(string memberId, string issueId, List<DiagnosticRecord> diagnostics, List<MemberInteraction> interactions)
        {
            var summary = new IssueSummary
            {
                SummaryText = diagnostics.Any() ? "Diagnostics indicate an issue requiring attention." : "No diagnostics available.",
                LikelyCause = interactions.Any() ? "Based on recent interactions, user-reported behavior is a likely cause." : "Cause based on diagnostics only."
            };
            return summary;
        }
    }
}
