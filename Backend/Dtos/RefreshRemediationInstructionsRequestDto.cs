using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RefreshRemediationInstructionsRequestDto
    {
        [Required]
        public string IssueId { get; set; } = string.Empty;
    }
}
