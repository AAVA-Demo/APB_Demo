using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IAiInsightCacheRepository
    {
        Task<List<AiInsightCache>> GetByInteractionId(string interactionId);
        Task AddAsync(AiInsightCache cache);
    }
}
