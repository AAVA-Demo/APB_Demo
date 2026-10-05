namespace Backend.Dtos
{
    public class RemediationStepListResponse
    {
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new();
        public string? NextStepId { get; set; }
    }
}
