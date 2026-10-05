using System;
using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationInstructionResponseDto
    {
        public string CaseId { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new List<RemediationStepDto>();
        public DateTime GeneratedAt { get; set; }
    }
}
