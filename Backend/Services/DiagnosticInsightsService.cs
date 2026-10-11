using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Services
{
    public class DiagnosticInsightsService : IDiagnosticInsightsService
    {
        private readonly ITelemetryStreamService _telemetryStreamService;
        private readonly ICaseContextService _caseContextService;

        public DiagnosticInsightsService(ITelemetryStreamService telemetryStreamService, ICaseContextService caseContextService)
        {
            _telemetryStreamService = telemetryStreamService;
            _caseContextService = caseContextService;
        }

        public async Task<CaseRealTimeInsightsDto> GetInsightsAsync(string caseId)
        {
            var telemetry = await _telemetryStreamService.GetLatestTelemetryAsync(caseId);
            if (telemetry == null)
            {
                throw new TelemetryUnavailableException();
            }

            var context = await _caseContextService.GetCaseContextAsync(caseId);
            if (context == null)
            {
                throw new CaseNotFoundException();
            }

            var insights = telemetry.MetricsJson.Split(';')
                .Where(m => !string.IsNullOrWhiteSpace(m))
                .Select((m, index) => new InsightDto
                {
                    Id = $"{caseId}-rt-{index}",
                    Text = $"Metric: {m} (Status: {context.Status})",
                    Timestamp = DateTime.UtcNow
                })
                .ToList();

            return new CaseRealTimeInsightsDto
            {
                CaseId = caseId,
                Insights = insights
            };
        }
    }
}
