using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightMapper
    {
        DiagnosticInsightResponseDto ToDiagnosticInsightResponse(RawDiagnosticInsightResponse raw);
    }
}
