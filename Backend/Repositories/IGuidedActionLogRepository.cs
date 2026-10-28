using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IGuidedActionLogRepository
    {
        Task AddAsync(GuidedActionExecutionLog log);
        Task<List<GuidedActionExecutionLog>> GetByInteractionId(string interactionId);
    }
}
