using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationStepsResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new List<RemediationStepDto>();
    }
}
