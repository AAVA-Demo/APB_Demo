using System;

namespace Backend.Dtos
{
    public class ContextAwareInsightsResponseDto
    {
        public string MemberId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string[] Insights { get; set; } = Array.Empty<string>();
        public MemberHistoryEventDto[] ReferencedHistory { get; set; } = Array.Empty<MemberHistoryEventDto>();
        public DateTime GeneratedAt { get; set; }
    }
}
