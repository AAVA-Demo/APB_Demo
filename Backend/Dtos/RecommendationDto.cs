using System;

namespace Backend.Dtos
{
    public class RecommendationDto
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public string Text { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string? Source { get; set; }
    }
}
