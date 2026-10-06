using System;

namespace Backend.Models
{
    public class CaseEvent
    {
        public string EventId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string PayloadJson { get; set; } = string.Empty;
        public DateTime OccurredAtUtc { get; set; }
    }
}
