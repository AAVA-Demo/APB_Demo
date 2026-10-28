using System.Collections.Generic;
using Backend.Models;

namespace Backend.Dtos
{
    public class AiInsightsResponseDto
    {
        public string InteractionId { get; set; } = string.Empty;
        public List<AiInsight> Insights { get; set; } = new List<AiInsight>();
    }
}
