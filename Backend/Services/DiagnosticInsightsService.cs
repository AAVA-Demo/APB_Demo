using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightsService : IDiagnosticInsightsService
    {
        private readonly IIssueContextService _issueContextService;
        private readonly IAIInternalDiagnosticEngine _aiInternalDiagnosticEngine;
        private static readonly ConcurrentDictionary<string, (DiagnosticInsightsDto dto, DateTime cachedAt)> Cache = new();

        public DiagnosticInsightsService(IIssueContextService issueContextService, IAIInternalDiagnosticEngine aiInternalDiagnosticEngine)
        {
            _issueContextService = issueContextService;
            _aiInternalDiagnosticEngine = aiInternalDiagnosticEngine;
        }

        public async Task<DiagnosticInsightsDto> GetInsights(string memberIssueId, string agentId)
        {
            if (string.IsNullOrWhiteSpace(memberIssueId))
            {
                throw new DiagnosticInsightsServiceValidationException("Member issue identifier is required.");
            }

            if (string.IsNullOrWhiteSpace(agentId))
            {
                throw new DiagnosticInsightsServiceValidationException("Authenticated agent is required.");
            }

            if (Cache.TryGetValue(memberIssueId, out var cached) && (DateTime.UtcNow - cached.cachedAt).TotalSeconds <= 30)
            {
                return cached.dto;
            }

            var context = await _issueContextService.GetIssueContext(memberIssueId);
            if (context == null)
            {
                throw new MemberIssueNotFoundException("Member issue not found.");
            }

            var result = await _aiInternalDiagnosticEngine.GenerateInsights(context);
            if (result == null)
            {
                throw new DiagnosticInsightsNotAvailableException("Diagnostic insights are not available for this issue.");
            }

            var dto = new DiagnosticInsightsDto
            {
                MemberIssueId = memberIssueId,
                GeneratedAt = DateTime.UtcNow,
                RootCauseSummary = result.RootCauseSummary,
                ContributingFactors = result.ContributingFactors ?? new List<string>()
            };

            Cache[memberIssueId] = (dto, DateTime.UtcNow);
            return dto;
        }
    }
}
