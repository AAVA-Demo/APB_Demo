using Backend.Models;

namespace Backend.Services
{
    public class MemberImpactAssessmentEngine
    {
        public double CalculateIssueImpact(MemberIssue issue)
        {
            var score = issue.BaseSeverity + issue.Frequency;
            if (score < 0)
            {
                throw new ArgumentException("Impact score must be non-negative");
            }
            return score;
        }

        public double CalculateRecommendationImpact(MemberRecommendation recommendation)
        {
            var score = recommendation.BaseImpact;
            if (score < 0)
            {
                throw new ArgumentException("Impact score must be non-negative");
            }
            return score;
        }

        public string DeriveImpactLevel(double score)
        {
            if (score >= 8) return "HIGH";
            if (score >= 4) return "MEDIUM";
            return "LOW";
        }
    }
}
