using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RemediationStepDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "StepNumber must be positive and unique.")]
        public int StepNumber { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
    }
}
