using System.Collections.Generic;
using Backend.Models;

namespace Backend.Dtos
{
    public class ContextAwareRecommendationsResponseDto
    {
        public string InteractionId { get; set; } = string.Empty;
        public string AccountId { get; set; } = string.Empty;
        public string CaseId { get; set; } = string.Empty;
        public List<Recommendation> Recommendations { get; set; } = new List<Recommendation>();
    }
}
