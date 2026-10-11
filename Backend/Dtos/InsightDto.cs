using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class InsightDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;
        [Required]
        public string Text { get; set; } = string.Empty;
        public DateTime? Timestamp { get; set; }
        public string ConfidenceLevel { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string Type { get; set; } = string.Empty;
    }
}
