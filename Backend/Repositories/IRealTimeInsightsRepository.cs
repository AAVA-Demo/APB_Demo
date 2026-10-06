using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRealTimeInsightsRepository
    {
        Task SaveInsights(string caseId, List<RealTimeInsight> insights);
        Task<List<RealTimeInsight>> GetInsightsByCaseId(string caseId);
    }
}
