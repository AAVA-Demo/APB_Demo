using System;

namespace Backend.Models
{
    public class AiRecommendationResult
    {
        public string Id { get; set; } = string.Empty;
        public string MemberIssueId { get; set; } = string.Empty;
        public string StepCode { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
    }
}
