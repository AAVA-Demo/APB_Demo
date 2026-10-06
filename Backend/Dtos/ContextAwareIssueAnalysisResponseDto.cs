using System.Collections.Generic;

namespace Backend.Dtos
{
    public class ContextAwareIssueAnalysisResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string MemberId { get; set; } = string.Empty;
        public string ContextSnapshotId { get; set; } = string.Empty;
        public List<IssueDto> Issues { get; set; } = new List<IssueDto>();
    }
}
