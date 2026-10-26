using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class InsightRefreshHub : IInsightRefreshHub
    {
        public Task SendInsightsUpdated(string caseId, CurrentInsightsDto dto)
        {
            // Default implementation: no-op for now.
            return Task.CompletedTask;
        }
    }
}
