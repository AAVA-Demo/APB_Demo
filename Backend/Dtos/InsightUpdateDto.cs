using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class InsightDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class RecommendationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }

    public class InsightUpdateDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public List<InsightDto> Insights { get; set; } = new();
        public List<RecommendationDto> Recommendations { get; set; } = new();
    }

    public class InsightRefreshRequestDto
    {
        [Required]
        public string InteractionId { get; set; } = string.Empty;
    }

    public class InsightRefreshResponseDto
    {
        public string InteractionId { get; set; } = string.Empty;
        public DateTime RefreshedAt { get; set; }
    }
}
