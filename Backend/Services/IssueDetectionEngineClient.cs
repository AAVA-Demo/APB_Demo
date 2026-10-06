using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class IssueDetectionEngineClient : IIssueDetectionEngineClient
    {
        public Task<IssueDetectionResult> DetectIssues(MemberContext context)
        {
            var issues = new List<Issue>
            {
                new Issue
                {
                    IssueId = Guid.NewGuid().ToString(),
                    CaseId = context.CaseId,
                    ContextSnapshotId = Guid.NewGuid().ToString(),
                    Title = "Sample Issue",
                    Description = "Sample context-aware issue.",
                    Severity = "Medium",
                    RecommendationSummary = "Sample recommendation."
                }
            };

            var result = new IssueDetectionResult
            {
                ContextSnapshotId = issues[0].ContextSnapshotId,
                Issues = issues
            };
            return Task.FromResult(result);
        }
    }
}
