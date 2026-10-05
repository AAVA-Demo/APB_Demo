using System.Collections.Generic;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class InsightIndicatorEnrichmentService : IInsightIndicatorEnrichmentService
    {
        private readonly IAIInsightEngine _engine;
        private readonly IInsightIndicatorMapper _mapper;

        public InsightIndicatorEnrichmentService(IAIInsightEngine engine, IInsightIndicatorMapper mapper)
        {
            _engine = engine;
            _mapper = mapper;
        }

        public List<InsightIndicatorDto> GetInsightsWithIndicators(string caseId)
        {
            var baseInsights = _engine.GetInsights(caseId);
            var result = new List<InsightIndicatorDto>();

            foreach (var insight in baseInsights)
            {
                var priority = _mapper.MapPriority(insight.ConfidenceScore);
                result.Add(new InsightIndicatorDto
                {
                    Id = insight.Id,
                    Description = insight.Description,
                    ConfidenceScore = insight.ConfidenceScore,
                    Priority = priority
                });
            }

            return result;
        }
    }
}
