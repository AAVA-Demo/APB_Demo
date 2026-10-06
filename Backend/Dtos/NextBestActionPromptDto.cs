namespace Backend.Dtos
{
    public class NextBestActionPromptDto
    {
        public string MemberIssueId { get; set; } = string.Empty;
        public bool HasRecommendation { get; set; }
        public string PromptText { get; set; } = string.Empty;
        public string RecommendedStepCode { get; set; } = string.Empty;
    }
}
