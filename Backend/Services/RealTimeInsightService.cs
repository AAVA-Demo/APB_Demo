using System;
using System.Collections.Generic;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RealTimeInsightService : IRealTimeInsightService
    {
        private readonly IRealTimeInsightSource _source;

        public RealTimeInsightService(IRealTimeInsightSource source)
        {
            _source = source;
        }

        public RealTimeInsightsResponseDto GetRealTimeInsights(string caseId)
        {
            var insights = _source.GetLatestInsights(caseId);
            var limited = insights.Count > 10 ? insights.GetRange(0, 10) : insights;

            return new RealTimeInsightsResponseDto
            {
                CaseId = caseId,
                Insights = limited
            };
        }
    }
}
