using System;

namespace Backend.Models
{
    public class Case
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
