using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightsService : IDiagnosticInsightsService
    {
        private readonly IDiagnosticRepository _diagnosticRepository;
        private readonly DiagnosticInsightsEngine _engine;

        public DiagnosticInsightsService(IDiagnosticRepository diagnosticRepository, DiagnosticInsightsEngine engine)
        {
            _diagnosticRepository = diagnosticRepository;
            _engine = engine;
        }

        public async Task<DiagnosticInsightsResponse> GetCurrentInsightsAsync(string memberId)
        {
            if (string.IsNullOrWhiteSpace(memberId))
            {
                throw new ArgumentException("memberId is required");
            }

            var diagnostics = await _diagnosticRepository.FindByMemberIdAsync(memberId);
            var insights = _engine.GenerateInsights(diagnostics);

            return new DiagnosticInsightsResponse
            {
                MemberId = memberId,
                Insights = insights,
                LastUpdated = DateTime.UtcNow
            };
        }

        public async IAsyncEnumerable<DiagnosticInsightsResponse> SubscribeInsightsStreamAsync(string memberId, CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                var response = await GetCurrentInsightsAsync(memberId);
                yield return response;
                await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
            }
        }
    }
}
