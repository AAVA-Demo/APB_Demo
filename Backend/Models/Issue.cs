using System;

namespace Backend.Models
{
    public class Issue
    {
        public string Id { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = "Low";
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
