using System;

namespace Backend.Services
{
    public class InsightConfidenceService : IInsightConfidenceService
    {
        public string MapScoreToLevel(double score)
        {
            if (score < 0.0 || score > 1.0)
            {
                throw new InvalidOperationException("ConfidenceScore must be between 0 and 1.");
            }

            if (score >= 0.8) return "high";
            if (score >= 0.5) return "medium";
            return "low";
        }
    }
}
