using System;

namespace Backend.Models
{
    public class MemberInteractionEntity
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public Guid CaseId { get; set; }
        public string Channel { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public DateTime OccurredAt { get; set; }
    }
}
