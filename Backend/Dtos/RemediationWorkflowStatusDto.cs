namespace Backend.Dtos
{
    public class RemediationWorkflowStatusDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string WorkflowId { get; set; } = string.Empty;
        public string OverallStatus { get; set; } = string.Empty;
        public int CompletedStepCount { get; set; }
        public int TotalStepCount { get; set; }
    }
}
