using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationGuidanceDto
    {
        public string MemberIssueId { get; set; } = string.Empty;
        public string IssueSummary { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new List<RemediationStepDto>();
    }
}
