namespace Backend.Models
{
    public class IdentifiedIssue
    {
        public string Id { get; set; } = string.Empty;
        public string IssueCode { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
    }
}
