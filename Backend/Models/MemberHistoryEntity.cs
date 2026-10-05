using System;

namespace Backend.Models
{
    public class MemberHistoryEntity
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public Guid? CaseId { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime OccurredAt { get; set; }
    }
}
