namespace Backend.Models
{
    public class RemediationTemplate
    {
        public string Id { get; set; } = string.Empty;
        public string IssueCode { get; set; } = string.Empty;
        public int StepNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;
    }
}
