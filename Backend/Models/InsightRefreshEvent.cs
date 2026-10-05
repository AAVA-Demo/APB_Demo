using System;

namespace Backend.Models
{
    public class InsightRefreshEvent
    {
        public string EventId { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string Source { get; set; } = string.Empty;
    }
}
