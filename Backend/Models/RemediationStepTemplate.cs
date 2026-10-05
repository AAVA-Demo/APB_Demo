namespace Backend.Models
{
    public class RemediationStepTemplate
    {
        public string TemplateId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public int StepNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
