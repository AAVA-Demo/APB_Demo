using Backend.Models;

namespace Backend.Services
{
    public class SuggestionConfidenceEngine
    {
        public double CalculateConfidenceScore(Suggestion suggestion)
        {
            if (suggestion.ModelScore < 0 || suggestion.ModelScore > 1)
            {
                throw new ArgumentException("modelScore must be between 0 and 1");
            }
            var score = suggestion.ModelScore;
            if (score < 0)
            {
                throw new ArgumentException("confidenceScore must be non-negative");
            }
            return score;
        }

        public string DeriveConfidenceLevel(double score)
        {
            if (score >= 0.75) return "HIGH";
            if (score >= 0.5) return "MEDIUM";
            return "LOW";
        }
    }
}
