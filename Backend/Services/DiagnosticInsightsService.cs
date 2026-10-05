using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightsService : IDiagnosticInsightsService
    {
        private readonly ITelemetryRepository _telemetryRepository;
        private readonly ICaseRepository _caseRepository;

        public DiagnosticInsightsService(ITelemetryRepository telemetryRepository, ICaseRepository caseRepository)
        {
            _telemetryRepository = telemetryRepository;
            _caseRepository = caseRepository;
        }

        public async Task<DiagnosticInsightsDto?> GetInsightsAsync(string caseId)
        {
            var exists = await _caseRepository.CaseExistsAsync(caseId);
            if (!exists)
            {
                return null;
            }

            var insights = await _telemetryRepository.GetTelemetryInsightsAsync(caseId);

            return new DiagnosticInsightsDto
            {
                CaseId = caseId,
                Insights = insights,
                GeneratedAt = DateTime.UtcNow
            };
        }
    }
}
