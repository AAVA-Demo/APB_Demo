using Backend.Models;

namespace Backend.Services
{
    public interface IConfidenceCalculationPolicyProvider
    {
        ConfidenceLevelResult GetConfidenceLevel(double score);
    }
}
