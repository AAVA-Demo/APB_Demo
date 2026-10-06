using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsService
    {
        Task<DiagnosticInsightsDto> GetInsights(string memberIssueId, string agentId);
    }
}
