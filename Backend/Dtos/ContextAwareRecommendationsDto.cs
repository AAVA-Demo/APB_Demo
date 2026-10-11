using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class ContextAwareRecommendationsDto
    {
        [Required]
        public string CaseId { get; set; } = string.Empty;
        public List<string> Symptoms { get; set; } = new List<string>();
        public List<string> RecentInteractions { get; set; } = new List<string>();
        public List<RecommendationDto> Recommendations { get; set; } = new List<RecommendationDto>();
    }
}
