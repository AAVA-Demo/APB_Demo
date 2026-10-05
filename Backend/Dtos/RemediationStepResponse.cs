namespace Backend.Dtos
{
    public class RemediationStepResponse
    {
        public string MemberId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new();
    }
}
