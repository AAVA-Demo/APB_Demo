using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IInsightRefreshEventRepository
    {
        Task<List<InsightRefreshEvent>> GetByInteractionIdAsync(string interactionId);
        Task SaveAsync(InsightRefreshEvent refreshEvent);
    }
}
