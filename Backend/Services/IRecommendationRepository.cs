using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IRecommendationRepository
    {
        Task<List<RecommendationPattern>> GetPatternsAsync();
    }
}
