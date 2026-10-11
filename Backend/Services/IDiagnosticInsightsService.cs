using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsService
    {
        Task<CaseRealTimeInsightsDto> GetInsightsAsync(string caseId);
    }
}
