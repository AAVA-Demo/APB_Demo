using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class AiEngineClient : IAiEngineClient
    {
        public Task<List<DiagnosticInsight>> GetDiagnosticInsights(InteractionContext context)
        {
            var insights = new List<DiagnosticInsight>
            {
                new DiagnosticInsight
                {
                    InsightId = "diag-1",
                    Summary = "Possible connectivity issue",
                    ProbableCause = "Network latency detected"
                }
            };
            return Task.FromResult(insights);
        }

        public Task<List<Recommendation>> GetRecommendations(InteractionContext context)
        {
            var recommendations = new List<Recommendation>
            {
                new Recommendation
                {
                    RecommendationId = "rec-1",
                    Title = "Restart router",
                    Description = "Ask member to restart router to clear temporary faults.",
                    ContextSummary = "Based on connectivity diagnostics"
                }
            };
            return Task.FromResult(recommendations);
        }

        public Task<List<AiInsight>> GetInsights(string interactionId)
        {
            var insights = new List<AiInsight>
            {
                new AiInsight
                {
                    InsightId = "ai-1",
                    Title = "High likelihood of billing dispute",
                    Description = "Member mentions incorrect charges.",
                    ConfidenceScore = 0.85,
                    ConfidenceLevel = string.Empty
                }
            };
            return Task.FromResult(insights);
        }
    }
}
