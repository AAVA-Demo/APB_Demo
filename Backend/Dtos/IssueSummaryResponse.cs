namespace Backend.Dtos
{
    public class IssueSummaryResponse
    {
        public string MemberId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public string SummaryText { get; set; } = string.Empty;
        public string LikelyCause { get; set; } = string.Empty;
    }
}
