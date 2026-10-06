using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class RecommendationResult
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public List<RecommendationItem> Items { get; set; } = new List<RecommendationItem>();
        public DateTime GeneratedAtUtc { get; set; }
    }

    public class RecommendationItem
    {
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
    }
}
