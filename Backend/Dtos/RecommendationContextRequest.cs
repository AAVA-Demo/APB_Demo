using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RecommendationContextRequest
    {
        [Required]
        public string MemberId { get; set; } = string.Empty;

        [Required]
        public string CurrentIssueSummary { get; set; } = string.Empty;
    }
}
