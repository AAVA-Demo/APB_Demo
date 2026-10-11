using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class ResolutionSuggestionDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;
        [Required]
        public string Text { get; set; } = string.Empty;
        [Range(1, int.MaxValue, ErrorMessage = "Estimated resolution time must be positive.")]
        public int ExpectedResolutionTimeMinutes { get; set; }
        [Range(0.0, 1.0, ErrorMessage = "Success probability must be between 0 and 1.")]
        public double SuccessProbability { get; set; }
        public int Rank { get; set; }
        public bool IsTopSuggestion { get; set; }
    }
}
