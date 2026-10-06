namespace Backend.Dtos
{
    public class RemediationWorkflowStartResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public string WorkflowId { get; set; } = string.Empty;
        public string OverallStatus { get; set; } = string.Empty;
    }
}
