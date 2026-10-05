using System.Collections.Generic;
using System;

namespace Backend.Dtos
{
    public class IssueContextSummaryResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string SummaryText { get; set; } = string.Empty;
        public List<IssueEventDto> RecentEvents { get; set; } = new List<IssueEventDto>();
        public List<KeyIndicatorDto> KeyIndicators { get; set; } = new List<KeyIndicatorDto>();
    }

    public class IssueEventDto
    {
        public DateTimeOffset Timestamp { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class KeyIndicatorDto
    {
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}
