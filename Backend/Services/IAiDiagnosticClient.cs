using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class RawDiagnosticInsightResponse
    {
        public string InteractionId { get; set; } = string.Empty;
        public System.Collections.Generic.List<DiagnosticInsightDto> Insights { get; set; } = new();
    }

    public interface IAiDiagnosticClient
    {
        Task<RawDiagnosticInsightResponse> GetDiagnosticInsightsAsync(string interactionId);
    }
}
