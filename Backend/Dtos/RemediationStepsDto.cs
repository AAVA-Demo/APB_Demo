using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationStepsDto
    {
        public string CaseId { get; set; } = string.Empty;
        public string InsightId { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new();
    }
}
