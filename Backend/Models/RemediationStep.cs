namespace Backend.Models
{
    public class RemediationStep
    {
        public string StepId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
