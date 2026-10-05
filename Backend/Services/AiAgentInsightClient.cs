using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class AiAgentInsightClient : IAiAgentInsightClient
    {
        public Task<RawAiInsightResponse> GetRawInsightsAsync(string interactionId)
        {
            var response = new RawAiInsightResponse
            {
                InteractionId = interactionId,
                Insights = new List<RawAiInsightItem>
                {
                    new RawAiInsightItem
                    {
                        Code = "ai-1",
                        Message = "Technical issue with connection.",
                        Confidence = 0.9
                    }
                },
                Remediations = new List<RawAiRemediationItem>
                {
                    new RawAiRemediationItem
                    {
                        Code = "step-1",
                        Details = "Restart the application.",
                        Sequence = 1
                    }
                }
            };

            return Task.FromResult(response);
        }
    }
}
