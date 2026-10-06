using System.Collections.Generic;

namespace Backend.Dtos
{
    public class InsightWithConfidenceDto
    {
        public string InsightId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public string ConfidenceLevel { get; set; } = string.Empty;
        public string ConfidenceLabel { get; set; } = string.Empty;
        public List<RemediationStepDto> RemediationSteps { get; set; } = new List<RemediationStepDto>();
    }
}
