using System;

namespace Backend.Dtos
{
    public class RemediationStepStatusDto
    {
        public string StepInstanceId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime UpdatedAtUtc { get; set; }
    }
}
