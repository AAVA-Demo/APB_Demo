using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class DiagnosticInsightService : IDiagnosticInsightService
    {
        private readonly IAiDiagnosticClient _aiClient;
        private readonly IDiagnosticInsightMapper _mapper;

        public DiagnosticInsightService(IAiDiagnosticClient aiClient, IDiagnosticInsightMapper mapper)
        {
            _aiClient = aiClient;
            _mapper = mapper;
        }

        public async Task<DiagnosticInsightResponseDto> GetDiagnosticInsightsAsync(string interactionId)
        {
            ValidateInteractionId(interactionId);
            var raw = await _aiClient.GetDiagnosticInsightsAsync(interactionId);
            var response = _mapper.ToDiagnosticInsightResponse(raw);
            ValidateInsights(response);
            return response;
        }

        public Task<DiagnosticInsightResponseDto> ProcessDiagnosticInsightsAsync(string interactionId)
        {
            return GetDiagnosticInsightsAsync(interactionId);
        }

        private static void ValidateInteractionId(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InvalidOperationException("interactionId is required");
            }
        }

        private static void ValidateInsights(DiagnosticInsightResponseDto response)
        {
            if (response.Insights == null || response.Insights.Count == 0)
            {
                throw new InvalidOperationException("No diagnostic insights available");
            }

            foreach (var insight in response.Insights)
            {
                if (insight.Confidence < 0.0 || insight.Confidence > 1.0)
                {
                    throw new InvalidOperationException("Invalid confidence score");
                }
            }
        }
    }
}
