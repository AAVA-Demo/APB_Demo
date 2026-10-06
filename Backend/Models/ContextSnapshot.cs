using System;

namespace Backend.Models
{
    public class ContextSnapshot
    {
        public string ContextSnapshotId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public DateTime CreatedAtUtc { get; set; }
    }
}
