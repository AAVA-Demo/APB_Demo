using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Services
{
    public interface IInsightRefreshService
    {
        Task<CurrentInsightsDto> GetCurrentInsights(string caseId);
        Task HandleCaseEventAsync(CaseEvent caseEvent);
    }
}
