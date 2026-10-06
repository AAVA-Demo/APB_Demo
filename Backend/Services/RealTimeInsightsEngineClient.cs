using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class RealTimeInsightsEngineClient : IRealTimeInsightsEngineClient
    {
        public Task<List<RealTimeInsight>> GenerateRealTimeInsights(MemberInteractionContext context)
        {
            var insights = new List<RealTimeInsight>
            {
                new RealTimeInsight
                {
                    InsightId = Guid.NewGuid().ToString(),
                    CaseId = context.CaseId,
                    Title = "Sample Real-Time Insight",
                    Description = "This is a sample real-time diagnostic insight.",
                    Severity = "Info",
                    CreatedAtUtc = DateTime.UtcNow
                }
            };
            return Task.FromResult(insights);
        }
    }
}
