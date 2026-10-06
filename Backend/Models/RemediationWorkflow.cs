using System.Collections.Generic;

namespace Backend.Models
{
    public class RemediationWorkflow
    {
        public string WorkflowId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public string IssueId { get; set; } = string.Empty;
        public List<RemediationStepInstance> Steps { get; set; } = new List<RemediationStepInstance>();
        public string OverallStatus { get; set; } = string.Empty;
    }
}
