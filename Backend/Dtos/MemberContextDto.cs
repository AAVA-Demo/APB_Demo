using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class MemberContextDto
    {
        public System.Guid MemberId { get; set; }
        public System.Guid CaseId { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public IList<InteractionDto> RecentActivity { get; set; } = new List<InteractionDto>();
        public IList<HistoryItemDto> RelevantHistory { get; set; } = new List<HistoryItemDto>();
    }

    public class InteractionDto
    {
        public System.Guid Id { get; set; }
        public string Channel { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public System.DateTime OccurredAt { get; set; }
    }

    public class HistoryItemDto
    {
        public System.Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public System.DateTime OccurredAt { get; set; }
    }
}
