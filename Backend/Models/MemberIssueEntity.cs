using System;

namespace Backend.Models
{
    public class MemberIssueEntity
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public string CaseNumber { get; set; } = string.Empty;
        public string IssueDescription { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
