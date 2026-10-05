using System;

namespace Backend.Models
{
    public class Interaction
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public string Channel { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public DateTime OccurredAt { get; set; }
    }
}
