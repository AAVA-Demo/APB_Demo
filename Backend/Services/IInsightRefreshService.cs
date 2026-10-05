using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightRefreshService
    {
        IAsyncEnumerable<InsightUpdateDto> SubscribeAsync(string interactionId);
        Task<InsightRefreshResponseDto> RefreshInsightsAsync(string interactionId);
    }
}
