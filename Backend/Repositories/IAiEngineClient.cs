using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAiEngineClient
    {
        Task<List<DiagnosticInsight>> GetDiagnosticInsights(InteractionContext context);
        Task<List<Recommendation>> GetRecommendations(InteractionContext context);
        Task<List<AiInsight>> GetInsights(string interactionId);
    }
}
