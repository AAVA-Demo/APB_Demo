using System;

namespace Backend.Models
{
    public class InsightEntity
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string ConfidenceBand { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
