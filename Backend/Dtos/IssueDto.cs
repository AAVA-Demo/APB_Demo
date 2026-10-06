namespace Backend.Dtos
{
    public class IssueDto
    {
        public string IssueId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string RecommendationSummary { get; set; } = string.Empty;
    }
}
