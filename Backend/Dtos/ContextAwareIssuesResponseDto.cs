using System.Collections.Generic;

namespace Backend.Dtos
{
    public class ContextAwareIssuesResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string ContextSnapshotId { get; set; } = string.Empty;
        public List<IssueDto> Issues { get; set; } = new List<IssueDto>();
    }
}
