using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightPriorityService
    {
        Task<InsightListDto> GetPrioritizedInsights(string caseId);
    }
}
