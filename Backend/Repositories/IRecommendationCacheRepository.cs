using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationCacheRepository
    {
        Task<List<RecommendationCache>> GetByInteractionId(string interactionId);
        Task AddAsync(RecommendationCache cache);
    }
}
