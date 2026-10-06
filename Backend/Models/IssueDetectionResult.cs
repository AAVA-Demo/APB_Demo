using System.Collections.Generic;

namespace Backend.Models
{
    public class IssueDetectionResult
    {
        public string ContextSnapshotId { get; set; } = string.Empty;
        public List<Issue> Issues { get; set; } = new List<Issue>();
    }
}
