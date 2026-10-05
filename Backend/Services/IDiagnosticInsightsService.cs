using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsService
    {
        Task<DiagnosticInsightsResponse> GetCurrentInsightsAsync(string memberId);
        IAsyncEnumerable<DiagnosticInsightsResponse> SubscribeInsightsStreamAsync(string memberId, CancellationToken cancellationToken);
    }
}
