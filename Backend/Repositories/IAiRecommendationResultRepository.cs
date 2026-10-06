using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAiRecommendationResultRepository
    {
        Task<List<AiRecommendationResult>> GetByMemberIssueIdAsync(string memberIssueId);
    }
}
