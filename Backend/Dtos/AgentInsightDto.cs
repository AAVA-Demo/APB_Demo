using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class AgentDiagnosticInsightDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class AgentRemediationStepDto
    {
        public int StepNumber { get; set; }
        public string Instruction { get; set; } = string.Empty;
    }

    public class AgentInsightResponseDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
        public string IssueContext { get; set; } = string.Empty;
        public List<AgentDiagnosticInsightDto> DiagnosticInsights { get; set; } = new();
        public List<AgentRemediationStepDto> RemediationSteps { get; set; } = new();
    }

    public class AgentInsightTransformRequestDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
        [Required]
        public List<RawAgentInsightItemDto> RawInsights { get; set; } = new();
        public List<RawAgentRemediationItemDto> RawRemediations { get; set; } = new();
    }

    public class RawAgentInsightItemDto
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }

    public class RawAgentRemediationItemDto
    {
        public string Code { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public int Sequence { get; set; }
    }
}
