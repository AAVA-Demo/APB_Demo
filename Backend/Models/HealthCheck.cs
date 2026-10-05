using System;

namespace Backend.Models
{
    public class HealthCheck
    {
        public int Id { get; set; }
        public DateTime CheckedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Message { get; set; }
    }
}
