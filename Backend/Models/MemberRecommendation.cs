namespace Backend.Models
{
    public class MemberRecommendation
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int BaseImpact { get; set; }
    }
}
