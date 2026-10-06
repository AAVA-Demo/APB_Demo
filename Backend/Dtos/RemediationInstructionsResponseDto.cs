using System.Collections.Generic;

namespace Backend.Dtos
{
    public class RemediationInstructionsResponseDto
    {
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationInstructionDto> Instructions { get; set; } = new List<RemediationInstructionDto>();
    }
}
