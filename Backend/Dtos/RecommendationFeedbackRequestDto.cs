using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RecommendationFeedbackRequestDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;

        [Required]
        public string MemberId { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(HELPFUL|NOT_HELPFUL)$", ErrorMessage = "feedbackType must be HELPFUL or NOT_HELPFUL")]
        public string FeedbackType { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Comment { get; set; }
    }
}
