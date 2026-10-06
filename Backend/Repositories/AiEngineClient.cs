using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class AiEngineClient : IAiEngineClient
    {
        public Task<AiDiagnosticResult?> GetDiagnosticsAsync(CaseData caseData)
        {
            var result = new AiDiagnosticResult
            {
                CaseId = caseData.CaseId,
                EngineName = "DefaultAiEngine",
                GeneratedAtUtc = DateTime.UtcNow,
                Items = new List<DiagnosticItem>
                {
                    new DiagnosticItem
                    {
                        Code = "GEN001",
                        Title = "Sample Insight",
                        Description = "Generated diagnostic insight.",
                        Severity = "Medium",
                        LastUpdatedUtc = DateTime.UtcNow
                    }
                }
            };
            return Task.FromResult<AiDiagnosticResult?>(result);
        }

        public Task<RemediationPlanResult?> GetRemediationPlanAsync(IssueData issueData)
        {
            var result = new RemediationPlanResult
            {
                CaseId = issueData.CaseId,
                IssueId = issueData.IssueId,
                GeneratedAtUtc = DateTime.UtcNow,
                Steps = new List<RemediationStep>
                {
                    new RemediationStep
                    {
                        StepOrder = 1,
                        Title = "Review issue details",
                        Description = issueData.Summary,
                        EstimatedDurationMinutes = 5
                    }
                }
            };
            return Task.FromResult<RemediationPlanResult?>(result);
        }

        public Task<RecommendationResult?> GetRecommendationsAsync(CaseContext caseContext)
        {
            var result = new RecommendationResult
            {
                CaseId = caseContext.CaseId,
                MemberId = caseContext.MemberId,
                GeneratedAtUtc = DateTime.UtcNow,
                Items = new List<RecommendationItem>
                {
                    new RecommendationItem
                    {
                        Code = "REC001",
                        Title = "Follow-up call",
                        Description = "Contact member to confirm resolution.",
                        Priority = "High"
                    }
                }
            };
            return Task.FromResult<RecommendationResult?>(result);
        }
    }
}
