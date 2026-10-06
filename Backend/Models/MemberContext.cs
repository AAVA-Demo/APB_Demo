namespace Backend.Models
{
    public class MemberContext
    {
        public string MemberId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string HistoricalDataJson { get; set; } = string.Empty;
        public string CurrentDataJson { get; set; } = string.Empty;
    }
}
