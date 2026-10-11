using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RecommendationDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;
        [Required]
        public string Text { get; set; } = string.Empty;
        public List<string> ReferencedSymptoms { get; set; } = new List<string>();
        public List<string> ReferencedInteractions { get; set; } = new List<string>();
    }
}
