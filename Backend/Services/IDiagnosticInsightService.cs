using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightService
    {
        DiagnosticPanelResponseDto? GetPanelData(string caseId, string? memberId);
    }
}
