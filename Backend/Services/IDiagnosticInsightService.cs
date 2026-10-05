using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightService
    {
        Task<DiagnosticInsightResponseDto> GetDiagnosticInsightsAsync(string interactionId);
        Task<DiagnosticInsightResponseDto> ProcessDiagnosticInsightsAsync(string interactionId);
    }
}
