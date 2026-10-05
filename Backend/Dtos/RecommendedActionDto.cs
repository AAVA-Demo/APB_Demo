using System;

namespace Backend.Dtos
{
    public class RecommendedActionDto
    {
        public Guid Id { get; set; }
        public Guid IssueId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PriorityRank { get; set; }
        public double ImpactScore { get; set; }
        public bool IsHighImpact { get; set; }
    }
}
