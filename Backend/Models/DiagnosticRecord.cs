namespace Backend.Models
{
    public class DiagnosticRecord
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public string Data { get; set; } = string.Empty;
        public string Metadata { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
