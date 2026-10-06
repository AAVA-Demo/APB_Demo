using System;
using Backend.Models;

namespace Backend.Services
{
    public class ConfidenceCalculationPolicyProvider : IConfidenceCalculationPolicyProvider
    {
        public ConfidenceLevelResult GetConfidenceLevel(double score)
        {
            if (score < 0.0 || score > 1.0)
            {
                throw new InvalidOperationException("Confidence score must be between 0.0 and 1.0.");
            }

            string level;
            string label;

            if (score < 0.33)
            {
                level = "Low";
                label = "Low confidence";
            }
            else if (score < 0.66)
            {
                level = "Medium";
                label = "Medium confidence";
            }
            else
            {
                level = "High";
                label = "High confidence";
            }

            return new ConfidenceLevelResult
            {
                ConfidenceScore = score,
                ConfidenceLevel = level,
                ConfidenceLabel = label
            };
        }
    }
}
