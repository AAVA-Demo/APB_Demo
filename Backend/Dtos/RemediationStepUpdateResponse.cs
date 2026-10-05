namespace Backend.Dtos
{
    public class RemediationStepUpdateResponse
    {
        public string IssueId { get; set; } = string.Empty;
        public string StepId { get; set; } = string.Empty;
        public bool Completed { get; set; }
        public string? NextStepId { get; set; }
    }
}
