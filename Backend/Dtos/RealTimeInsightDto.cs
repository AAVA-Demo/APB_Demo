using System;

namespace Backend.Dtos
{
    public class RealTimeInsightDto
    {
        public string InsightId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime CreatedAtUtc { get; set; }
    }
}
