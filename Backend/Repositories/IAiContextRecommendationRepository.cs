using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAiContextRecommendationRepository
    {
        Task<List<AiContextRecommendation>> GetByMemberIssueIdAsync(string memberIssueId);
    }
}
