namespace Backend.Models
{
    public class IssueData
    {
        public string IssueId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string DetailsJson { get; set; } = string.Empty;
    }
}
