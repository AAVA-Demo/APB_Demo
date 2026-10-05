using System;

namespace Backend.Models
{
    public class RemediationStepEntity
    {
        public Guid Id { get; set; }
        public Guid InsightId { get; set; }
        public int Order { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
