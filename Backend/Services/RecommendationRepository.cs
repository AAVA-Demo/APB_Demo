using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class RecommendationRepository : IRecommendationRepository
    {
        public Task<List<RecommendationPattern>> GetPatternsAsync()
        {
            var patterns = new List<RecommendationPattern>
            {
                new RecommendationPattern { Id = "rec-1", TemplateText = "Review logs for {symptom}." },
                new RecommendationPattern { Id = "rec-2", TemplateText = "Escalate {symptom} to tier 2 support." }
            };

            return Task.FromResult(patterns);
        }
    }
}
