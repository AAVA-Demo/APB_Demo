using System;

namespace Backend.Models
{
    public class AiAssistedResolution
    {
        public string Id { get; set; } = string.Empty;
        public string MemberIssueId { get; set; } = string.Empty;
        public DateTime ResolvedAt { get; set; }
        public int StepsExecuted { get; set; }
        public bool IsAiAssisted { get; set; }
    }
}
