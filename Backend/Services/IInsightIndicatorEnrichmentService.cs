using System.Collections.Generic;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IInsightIndicatorEnrichmentService
    {
        List<InsightIndicatorDto> GetInsightsWithIndicators(string caseId);
    }
}
