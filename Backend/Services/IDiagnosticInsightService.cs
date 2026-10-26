using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightService
    {
        Task<DiagnosticInsightListDto> GetDiagnosticInsights(string caseId);
    }
}
