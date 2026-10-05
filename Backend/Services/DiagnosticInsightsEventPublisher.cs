using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightsEventPublisher : IDiagnosticInsightsEventPublisher
    {
        private readonly IDiagnosticInsightsService _diagnosticInsightsService;
        private readonly DiagnosticInsightsUpdateService _diagnosticInsightsUpdateService;

        public DiagnosticInsightsEventPublisher(IDiagnosticInsightsService diagnosticInsightsService, DiagnosticInsightsUpdateService diagnosticInsightsUpdateService)
        {
            _diagnosticInsightsService = diagnosticInsightsService;
            _diagnosticInsightsUpdateService = diagnosticInsightsUpdateService;
        }

        public async Task PublishInsightsUpdatedAsync(string caseId)
        {
            var insights = await _diagnosticInsightsService.GetDiagnosticInsightsAsync(caseId);
            if (insights == null)
            {
                return;
            }

            var evt = new DiagnosticInsightEventDto
            {
                CaseId = caseId,
                Insights = insights.Insights.ToArray(),
                GeneratedAt = insights.GeneratedAt
            };

            await _diagnosticInsightsUpdateService.PublishToListenersAsync(evt);
        }
    }
}
