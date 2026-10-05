using System;

namespace Backend.Models
{
    public class MemberContextSnapshot
    {
        public Guid Id { get; set; }
        public string MemberId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string ContextDataJson { get; set; } = string.Empty;
        public DateTime CapturedAt { get; set; }
    }
}
