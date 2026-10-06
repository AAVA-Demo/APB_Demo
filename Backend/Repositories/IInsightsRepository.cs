using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IInsightsRepository
    {
        Task<List<Insight>> GetInsightsByCaseId(string caseId);
        Task SaveInsights(string caseId, List<Insight> insights);
        Task<InsightsRefreshInfo> GetLastRefreshInfo(string caseId);
        Task<Insight> GetInsightById(string insightId);
    }
}
