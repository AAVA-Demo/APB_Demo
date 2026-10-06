using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IAiDiagnosticService
    {
        Task<DiagnosticInsightDto> GetRealTimeDiagnosticsAsync(string caseId);
    }
}
