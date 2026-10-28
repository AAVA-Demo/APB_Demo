using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticInsightCacheRepository
    {
        Task<List<DiagnosticInsightCache>> GetByInteractionId(string interactionId);
        Task AddAsync(DiagnosticInsightCache cache);
    }
}
