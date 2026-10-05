namespace Backend.Dtos
{
    public class MemberImpactIssuesResponse
    {
        public string MemberId { get; set; } = string.Empty;
        public List<MemberImpactIssueDto> Issues { get; set; } = new();
    }
}
