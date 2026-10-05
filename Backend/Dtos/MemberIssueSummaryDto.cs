using System;

namespace Backend.Dtos
{
    public class MemberIssueSummaryDto
    {
        public Guid MemberId { get; set; }
        public string SummaryText { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public DateTime LastUpdatedAt { get; set; }
    }
}
