using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RemediationStepCompleteRequest
    {
        [Required]
        public string CompletedBy { get; set; } = string.Empty;
    }
}
