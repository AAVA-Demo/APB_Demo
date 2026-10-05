using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationsRepository
    {
        Task<IEnumerable<Recommendation>> GetRecommendationsAsync(string caseId, string memberId);
    }
}
