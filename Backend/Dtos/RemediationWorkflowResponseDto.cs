using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationWorkflowResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStepInstanceDto> Steps { get; set; } = new List<RemediationStepInstanceDto>();
        public string OverallStatus { get; set; } = string.Empty;
    }
}
