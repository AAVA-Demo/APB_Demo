namespace Backend.Models
{
    public class RemediationStep
    {
        public string CaseId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public int StepOrder { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
