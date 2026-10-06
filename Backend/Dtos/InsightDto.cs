using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class InsightDto
    {
        public string InsightId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime LastUpdatedUtc { get; set; }
        public List<RemediationStepDto> RemediationSteps { get; set; } = new List<RemediationStepDto>();
    }
}
