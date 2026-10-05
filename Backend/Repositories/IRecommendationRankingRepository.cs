using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationRankingRepository
    {
        Task<List<Recommendation>> GetByInteractionIdAsync(string interactionId);
        Task SaveAsync(IEnumerable<Recommendation> recommendations);
    }
}
