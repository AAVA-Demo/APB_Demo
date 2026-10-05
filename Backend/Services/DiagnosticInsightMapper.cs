using System.Linq;
using Backend.Dtos;

namespace Backend.Services
{
    public class DiagnosticInsightMapper : IDiagnosticInsightMapper
    {
        public DiagnosticInsightResponseDto ToDiagnosticInsightResponse(RawDiagnosticInsightResponse raw)
        {
            var response = new DiagnosticInsightResponseDto
            {
                InteractionId = raw.InteractionId,
                Insights = raw.Insights.Select(i => new DiagnosticInsightDto
                {
                    Id = i.Id,
                    RootCause = i.RootCause,
                    Confidence = i.Confidence
                }).ToList()
            };

            return response;
        }
    }
}
