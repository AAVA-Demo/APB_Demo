namespace Backend.Models
{
    public class Case
    {
        public string CaseId { get; set; } = string.Empty;
        public string WorkspaceId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RecentInteractions { get; set; } = string.Empty;
    }
}
