using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class RawAiInsightItem
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }

    public class RawAiRemediationItem
    {
        public string Code { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public int Sequence { get; set; }
    }

    public class RawAiInsightResponse
    {
        public string InteractionId { get; set; } = string.Empty;
        public List<RawAiInsightItem> Insights { get; set; } = new();
        public List<RawAiRemediationItem> Remediations { get; set; } = new();
    }

    public interface IAiAgentInsightClient
    {
        Task<RawAiInsightResponse> GetRawInsightsAsync(string interactionId);
    }
}
