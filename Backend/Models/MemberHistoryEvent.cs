using System;

namespace Backend.Models
{
    public class MemberHistoryEvent
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Type { get; set; } = string.Empty;
        public string EventId => Id;
    }
}
