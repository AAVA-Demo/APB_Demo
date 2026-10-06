namespace Backend.Models
{
    public class MemberIssue
    {
        public string Id { get; set; } = string.Empty;
        public string WorkspaceId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
    }
}
