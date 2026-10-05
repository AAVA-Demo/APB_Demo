using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class AiDiagnosticClient : IAiDiagnosticClient
    {
        public Task<RawDiagnosticInsightResponse> GetDiagnosticInsightsAsync(string interactionId)
        {
            var response = new RawDiagnosticInsightResponse
            {
                InteractionId = interactionId,
                Insights = new System.Collections.Generic.List<DiagnosticInsightDto>
                {
                    new DiagnosticInsightDto
                    {
                        Id = "diag-1",
                        RootCause = "Sample root cause",
                        Confidence = 0.9
                    }
                }
            };

            return Task.FromResult(response);
        }
    }
}
