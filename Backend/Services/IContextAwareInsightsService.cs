using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IContextAwareInsightsService
    {
        Task<ContextAwareInsightsResponseDto?> GetContextAwareInsightsAsync(string memberId, string caseId);
    }
}
