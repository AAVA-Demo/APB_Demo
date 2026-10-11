using System;

namespace Backend.Models
{
    public class CaseInsightRealtime
    {
        public string Id { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
