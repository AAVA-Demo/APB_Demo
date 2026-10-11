namespace Backend.Models
{
    public class CaseContextEntity
    {
        public string CaseId { get; set; } = string.Empty;
        public string SymptomsJson { get; set; } = string.Empty;
        public string RecentInteractionsJson { get; set; } = string.Empty;
    }
}
