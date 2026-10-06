using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationGuidanceDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new List<RemediationStepDto>();
    }

    public class RemediationStepDto
    {
        public int StepOrder { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? EstimatedDurationMinutes { get; set; }
    }
}
