using System;

namespace Backend.Dtos
{
    public class RealTimeInsightDto
    {
        public string Id { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public DateTimeOffset GeneratedAt { get; set; }
    }
}
