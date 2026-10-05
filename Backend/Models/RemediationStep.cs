namespace Backend.Models
{
    public class RemediationStep
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string MemberIssueId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public bool Completed { get; set; }
        public string CompletedBy { get; set; } = string.Empty;
        public DateTime? CompletedAt { get; set; }
    }
}
