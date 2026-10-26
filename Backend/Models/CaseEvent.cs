using System;

namespace Backend.Models
{
    public class CaseEvent
    {
        public string CaseId { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public DateTime OccurredAt { get; set; }
;    }
}
