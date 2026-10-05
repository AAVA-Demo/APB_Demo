using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class CaseResolutionMetricsRequestDto
    {
        [Required]
        [Range(1, long.MaxValue, ErrorMessage = "Handle time must be greater than zero")]
        public long HandleTimeSeconds { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Steps followed must be zero or positive")]
        public int StepsFollowed { get; set; }

        [Required(ErrorMessage = "AI guidance flag must be provided")]
        public bool AiGuidanceUsed { get; set; }
    }
}
