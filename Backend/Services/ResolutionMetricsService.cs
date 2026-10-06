using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class ResolutionMetricsService : IResolutionMetricsService
    {
        private readonly IMetricsFilterService _metricsFilterService;
        private readonly IAiAssistedResolutionRepository _aiAssistedResolutionRepository;

        public ResolutionMetricsService(IMetricsFilterService metricsFilterService, IAiAssistedResolutionRepository aiAssistedResolutionRepository)
        {
            _metricsFilterService = metricsFilterService;
            _aiAssistedResolutionRepository = aiAssistedResolutionRepository;
        }

        public async Task<AiAssistedResolutionMetricsDto> GetAiAssistedMetrics(DateTime fromDate, DateTime toDate, string teamLeadId)
        {
            _metricsFilterService.ValidateDateRange(fromDate, toDate);

            var records = await _aiAssistedResolutionRepository.GetAiAssistedInRangeAsync(fromDate, toDate);
            var list = records.ToList();
            if (!list.Any())
            {
                throw new MetricsNotAvailableException("No AI-assisted cases found for the selected period.");
            }

            var totalCases = list.Count;
            var avgMinutes = list.Average(r => (r.ResolvedAt - fromDate).TotalMinutes);
            var avgSteps = list.Average(r => r.StepsExecuted);

            return new AiAssistedResolutionMetricsDto
            {
                FromDate = fromDate,
                ToDate = toDate,
                TotalCases = totalCases,
                AverageResolutionTimeMinutes = avgMinutes,
                AverageStepsPerCase = avgSteps
            };
        }
    }
}
