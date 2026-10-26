using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IInsightRepository
    {
        Task<List<Insight>> GetByCaseIdAsync(string caseId);
        Task SaveInsightsAsync(string caseId, List<Insight> insights, System.DateTime lastUpdatedAt);
    }
}
