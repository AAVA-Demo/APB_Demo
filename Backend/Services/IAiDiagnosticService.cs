using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IAiDiagnosticService
    {
        Task<RealTimeDiagnosticInsightsResponseDto> GetRealTimeDiagnosticInsights(string interactionId);
    }
}
