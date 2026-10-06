namespace Backend.Models
{
    public class IssueContext
    {
        public string MemberIssueId { get; set; } = string.Empty;
        public string DataSnapshot { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public System.Collections.Generic.List<string> PreviousActions { get; set; } = new System.Collections.Generic.List<string>();
    }
}
