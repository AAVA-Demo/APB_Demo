using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class InsightConfidenceService : IInsightConfidenceService
    {
        private readonly IDiagnosticInsightsService _diagnosticInsightsService;
        private readonly IInsightsRepository _insightsRepository;
        private readonly IConfidenceCalculationPolicyProvider _policyProvider;

        public InsightConfidenceService(IDiagnosticInsightsService diagnosticInsightsService, IInsightsRepository insightsRepository, IConfidenceCalculationPolicyProvider policyProvider)
        {
            _diagnosticInsightsService = diagnosticInsightsService;
            _insightsRepository = insightsRepository;
            _policyProvider = policyProvider;
        }

        public async Task<InsightsWithConfidenceResponseDto> GetInsightsWithConfidence(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new InvalidOperationException("CaseId is required and must be valid.");
            }

            var rawInsights = await _insightsRepository.GetInsightsByCaseId(caseId);
            var response = await _diagnosticInsightsService.GetInsights(caseId);
            var memberId = response.MemberId;

            var insightsDtos = rawInsights.Select(insight =>
            {
                var level = _policyProvider.GetConfidenceLevel(insight.RawConfidenceScore);
                var stepsDtos = insight.RemediationSteps.Select(s => new RemediationStepDto
                {
                    StepId = s.StepId,
                    Order = s.Order,
                    Text = s.Text
                }).ToList();

                return new InsightWithConfidenceDto
                {
                    InsightId = insight.InsightId,
                    Title = insight.Title,
                    Description = insight.Description,
                    ConfidenceScore = level.ConfidenceScore,
                    ConfidenceLevel = level.ConfidenceLevel,
                    ConfidenceLabel = level.ConfidenceLabel,
                    RemediationSteps = stepsDtos
                };
            }).ToList();

            return new InsightsWithConfidenceResponseDto
            {
                CaseId = caseId,
                MemberId = memberId,
                Insights = insightsDtos
            };
        }

        public async Task<InsightConfidenceDetailsDto> GetConfidenceDetails(string insightId)
        {
            if (string.IsNullOrWhiteSpace(insightId))
            {
                throw new InvalidOperationException("InsightId is required and must reference an existing insight.");
            }

            var insight = await _insightsRepository.GetInsightById(insightId);
            var level = _policyProvider.GetConfidenceLevel(insight.RawConfidenceScore);

            return new InsightConfidenceDetailsDto
            {
                InsightId = insight.InsightId,
                ConfidenceScore = level.ConfidenceScore,
                ConfidenceLevel = level.ConfidenceLevel,
                ConfidenceLabel = level.ConfidenceLabel,
                Explanation = "Confidence label " + level.ConfidenceLabel + " derived from score " + level.ConfidenceScore.ToString("F2")
            };
        }

        public ConfidenceLevelResult MapScoreToLevel(double score)
        {
            return _policyProvider.GetConfidenceLevel(score);
        }
    }
}
