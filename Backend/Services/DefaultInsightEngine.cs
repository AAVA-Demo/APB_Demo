using System.Collections.Generic;
using Backend.Models;

namespace Backend.Services
{
    public class DefaultInsightEngine : IInsightEngine
    {
        public List<Insight> GenerateInsights(string caseId)
        {
            return new List<Insight>
            {
                new Insight
                {
                    CaseId = caseId,
                    InsightId = "auto-1",
                    Title = "Auto-generated insight",
                    Summary = "Default engine insight.",
                    Priority = "High"
                }
            };
        }
    }
}
