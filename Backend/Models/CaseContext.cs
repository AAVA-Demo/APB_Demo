using System;

namespace Backend.Models
{
    public class CaseContext
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public string HistoryJson { get; set; } = string.Empty;
        public DateTime LastUpdatedUtc { get; set; }
    }
}
