using System.Collections.Generic;

namespace Backend.Dtos
{
    public class CaseIssueListDto
    {
        public string CaseId { get; set; } = string.Empty;
        public List<IssueSeverityDto> Issues { get; set; } = new List<IssueSeverityDto>();
    }

    public class IssueSeverityDto
    {
        public string IssueId { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
    }
}
