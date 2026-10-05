using System;

namespace Backend.Dtos
{
    public class RecommendationFeedbackResponseDto
    {
        public string RecommendationId { get; set; } = string.Empty;
        public string FeedbackType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTimeOffset Timestamp { get; set; }
    }
}
