using System;

namespace Backend.Models
{
    public class GuidedActionExecutionLog
    {
        public string LogId { get; set; } = string.Empty;
        public string InteractionId { get; set; } = string.Empty;
        public string AgentId { get; set; } = string.Empty;
        public string ActionId { get; set; } = string.Empty;
        public string ActionName { get; set; } = string.Empty;
        public DateTime ExecutedAt { get; set; }
        public string AdditionalContext { get; set; } = string.Empty;
    }
}
