using System;

namespace Backend.Models
{
    public class Recommendation
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ImpactScore { get; set; }
        public int UrgencyScore { get; set; }
        public int PriorityRank { get; set; }
    }
}
