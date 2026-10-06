using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class InsightRefreshService : IInsightRefreshService
    {
        private readonly ICaseDataRepository _caseDataRepository;
        private readonly ICaseEventRepository _caseEventRepository;
        private readonly IAiDiagnosticService _aiDiagnosticService;

        public InsightRefreshService(
            ICaseDataRepository caseDataRepository,
            ICaseEventRepository caseEventRepository,
            IAiDiagnosticService aiDiagnosticService)
        {
            _caseDataRepository = caseDataRepository;
            _caseEventRepository = caseEventRepository;
            _aiDiagnosticService = aiDiagnosticService;
        }

        public async Task<RealTimeInsightDto> GetLatestInsightsAsync(string caseId)
        {
            var caseData = await _caseDataRepository.GetCaseByIdAsync(caseId);
            if (caseData == null)
            {
                throw new CaseNotFoundException();
            }

            var events = await _caseEventRepository.GetRecentEventsAsync(caseId);
            var diagnostics = await _aiDiagnosticService.GetRealTimeDiagnosticsAsync(caseId);

            var dto = new RealTimeInsightDto
            {
                CaseId = diagnostics.CaseId,
                Insights = diagnostics.Insights.Select(i => new RealTimeInsightItemDto
                {
                    Code = i.Code,
                    Title = i.Title,
                    Description = i.Description,
                    Severity = i.Severity,
                    LastUpdatedUtc = i.LastUpdatedUtc
                }).ToList()
            };

            return dto;
        }
    }
}
