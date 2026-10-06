using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class StartRemediationWorkflowRequestDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        [Required]
        public string IssueId { get; set; } = string.Empty;
    }
}
