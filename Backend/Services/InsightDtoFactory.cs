using System.Collections.Generic;
using System.Linq;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Services
{
    public class InsightDtoFactory : IInsightDtoFactory
    {
        private readonly IInsightConfidenceService _confidenceService;

        public InsightDtoFactory(IInsightConfidenceService confidenceService)
        {
            _confidenceService = confidenceService;
        }

        public CaseInsightsDto Build(string caseId, List<Insight> insights, List<Insight> remediations)
        {
            return new CaseInsightsDto
            {
                CaseId = caseId,
                Insights = insights.Select(BuildDto).ToList(),
                Remediations = remediations.Select(BuildDto).ToList()
            };
        }

        private InsightDto BuildDto(Insight insight)
        {
            var level = _confidenceService.MapScoreToLevel(insight.ConfidenceScore);
            return new InsightDto
            {
                Id = insight.Id,
                Text = insight.Text,
                ConfidenceScore = insight.ConfidenceScore,
                ConfidenceLevel = level,
                Type = insight.Type
            };
        }
    }
}
