using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class UpdateRemediationStepStatusRequestDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
