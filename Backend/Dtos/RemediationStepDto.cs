using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RemediationStepDto
    {
        public int StepNumber { get; set; }
        public string Instruction { get; set; } = string.Empty;
    }

    public class RemediationStepsResponseDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        [Required]
        public List<RemediationStepDto> Steps { get; set; } = new();
    }

    public class RemediationStepsBuildRequestDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
    }
}
