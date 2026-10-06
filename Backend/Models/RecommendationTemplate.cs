namespace Backend.Models
{
    public class RecommendationTemplate
    {
        public string Id { get; set; } = string.Empty;
        public string IssueStatus { get; set; } = string.Empty;
        public string PromptTextTemplate { get; set; } = string.Empty;
        public string StepCode { get; set; } = string.Empty;
    }
}
