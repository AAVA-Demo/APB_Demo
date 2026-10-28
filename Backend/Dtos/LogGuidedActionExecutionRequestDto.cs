using System;

namespace Backend.Dtos
{
    public class LogGuidedActionExecutionRequestDto
    {
        public string InteractionId { get; set; } = string.Empty;
        public string AgentId { get; set; } = string.Empty;
        public string ActionId { get; set; } = string.Empty;
        public string ActionName { get; set; } = string.Empty;
        public DateTime ExecutedAt { get; set; }
        public string AdditionalContext { get; set; } = string.Empty;
    }
}
