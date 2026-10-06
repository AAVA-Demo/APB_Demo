using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IAIRecommendationEngine
    {
        Task<List<RecommendationDtoInternal>> GenerateRecommendations(MemberContext context);
    }

    public class RecommendationDtoInternal
    {
        public string RecommendationId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContextSummary { get; set; } = string.Empty;
    }
}
