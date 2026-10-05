namespace Backend.Models
{
    public class MemberIssue
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int BaseSeverity { get; set; }
        public int Frequency { get; set; }
    }
}
