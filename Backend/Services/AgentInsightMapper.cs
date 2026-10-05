using System.Linq;
using Backend.Dtos;

namespace Backend.Services
{
    public class AgentInsightMapper : IAgentInsightMapper
    {
        public AgentInsightResponseDto ToAgentInsightResponse(RawAiInsightResponse raw)
        {
            var diagnostics = raw.Insights.Select(i => new AgentDiagnosticInsightDto
            {
                Id = i.Code,
                Title = ApplyLanguageSimplification(i.Message),
                Description = ApplyLanguageSimplification(i.Message)
            }).ToList();

            var steps = raw.Remediations
                .OrderBy(r => r.Sequence)
                .Select(r => new AgentRemediationStepDto
                {
                    StepNumber = r.Sequence,
                    Instruction = ApplyLanguageSimplification(r.Details)
                }).ToList();

            return new AgentInsightResponseDto
            {
                InteractionId = raw.InteractionId,
                IssueContext = "", // can be enriched by caller
                DiagnosticInsights = diagnostics,
                RemediationSteps = steps
            };
        }

        public string ApplyLanguageSimplification(string rawText)
        {
            return rawText;
        }
    }
}
