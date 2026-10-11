using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class CaseRemediationStepsDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        [Required]
        public string IssuePatternId { get; set; } = string.Empty;
        public List<RemediationStepDto> Steps { get; set; } = new List<RemediationStepDto>();
    }
}
