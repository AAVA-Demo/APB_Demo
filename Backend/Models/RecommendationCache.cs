using System;

namespace Backend.Models
{
    public class RecommendationCache
    {
        public string Id { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public string AccountId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string RecommendationId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContextSummary { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
