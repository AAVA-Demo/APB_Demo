using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RankedRecommendationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public int Rank { get; set; }
    }

    public class RankedRecommendationResponseDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
        [Required]
        public List<RankedRecommendationDto> Recommendations { get; set; } = new();
    }

    public class RecommendationRankRequestDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
        [Required]
        public List<RawRecommendationItemDto> RawRecommendations { get; set; } = new();
    }

    public class RawRecommendationItemDto
    {
        public string Code { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }
}
