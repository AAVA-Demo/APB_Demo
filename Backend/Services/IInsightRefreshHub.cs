using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightRefreshHub
    {
        Task SendInsightsUpdated(string caseId, CurrentInsightsDto dto);
    }
}
