using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class AgentInsightLanguageService : IAgentInsightLanguageService
    {
        private readonly IAiAgentInsightClient _aiClient;
        private readonly IAgentInsightMapper _mapper;

        public AgentInsightLanguageService(IAiAgentInsightClient aiClient, IAgentInsightMapper mapper)
        {
            _aiClient = aiClient;
            _mapper = mapper;
        }

        public async Task<AgentInsightResponseDto> GetAgentFriendlyInsightsAsync(string interactionId)
        {
            ValidateInteractionId(interactionId);
            var raw = await _aiClient.GetRawInsightsAsync(interactionId);
            if (raw.Insights == null || raw.Insights.Count == 0)
            {
                throw new InvalidOperationException("AI insights not available");
            }

            var dto = _mapper.ToAgentInsightResponse(raw);
            return dto;
        }

        public Task<AgentInsightResponseDto> TransformRawInsightsAsync(AgentInsightTransformRequestDto request)
        {
            ValidateInteractionId(request.InteractionId);
            if (request.RawInsights == null || request.RawInsights.Count == 0)
            {
                throw new InvalidOperationException("AI insights not available");
            }

            var raw = new RawAiInsightResponse
            {
                InteractionId = request.InteractionId,
                Insights = request.RawInsights.Select(r => new RawAiInsightItem
                {
                    Code = r.Code,
                    Message = r.Message,
                    Confidence = r.Confidence
                }).ToList(),
                Remediations = (request.RawRemediations ?? new System.Collections.Generic.List<RawAgentRemediationItemDto>()).Select(r => new RawAiRemediationItem
                {
                    Code = r.Code,
                    Details = r.Details,
                    Sequence = r.Sequence
                }).ToList()
            };

            var dto = _mapper.ToAgentInsightResponse(raw);
            return Task.FromResult(dto);
        }

        private static void ValidateInteractionId(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InvalidOperationException("interactionId is required");
            }
        }
    }
}
