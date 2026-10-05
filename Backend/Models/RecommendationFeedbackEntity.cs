using System;

namespace Backend.Models
{
    public class RecommendationFeedbackEntity
    {
        public long Id { get; set; }
        public string RecommendationId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string FeedbackType { get; set; } = string.Empty;
        public string? Comment { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }
}
