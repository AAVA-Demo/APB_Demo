using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightRefreshService
    {
        Task<RealTimeInsightDto> GetLatestInsightsAsync(string caseId);
    }
}
