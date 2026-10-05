using System.Collections.Generic;

namespace Backend.Dtos
{
    public class GuidedResolutionWorkflowDto
    {
        public string IssueId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<GuidedResolutionStepDto> Steps { get; set; } = new();
    }
}
