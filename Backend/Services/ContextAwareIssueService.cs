using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class ContextAwareIssueService : IContextAwareIssueService
    {
        private readonly IMemberContextService _memberContextService;
        private readonly IIssueDetectionEngineClient _issueDetectionEngineClient;
        private readonly IIssueRepository _issueRepository;

        public ContextAwareIssueService(IMemberContextService memberContextService, IIssueDetectionEngineClient issueDetectionEngineClient, IIssueRepository issueRepository)
        {
            _memberContextService = memberContextService;
            _issueDetectionEngineClient = issueDetectionEngineClient;
            _issueRepository = issueRepository;
        }

        public async Task<ContextAwareIssueAnalysisResponseDto> AnalyzeCase(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new InvalidOperationException("CaseId is required and must reference an existing member case.");
            }

            var context = await _memberContextService.GetMemberContext(caseId);
            if (string.IsNullOrWhiteSpace(context.HistoricalDataJson) || string.IsNullOrWhiteSpace(context.CurrentDataJson))
            {
                throw new InvalidOperationException("Member context must include historical and current data.");
            }

            var detectionResult = await _issueDetectionEngineClient.DetectIssues(context);
            if (detectionResult.Issues == null || !detectionResult.Issues.Any())
            {
                throw new InvalidOperationException("No issues detected for the given context.");
            }

            await _issueRepository.SaveIssues(caseId, detectionResult.ContextSnapshotId, detectionResult.Issues);

            var dtoIssues = detectionResult.Issues.Select(MapIssueToDto).ToList();
            return new ContextAwareIssueAnalysisResponseDto
            {
                CaseId = caseId,
                MemberId = context.MemberId,
                ContextSnapshotId = detectionResult.ContextSnapshotId,
                Issues = dtoIssues
            };
        }

        public async Task<ContextAwareIssuesResponseDto> GetIssues(string caseId)
        {
            var issues = await _issueRepository.GetIssuesByCaseId(caseId);
            var snapshotId = await _issueRepository.GetLatestContextSnapshotId(caseId);
            var dtoIssues = issues.Select(MapIssueToDto).ToList();
            return new ContextAwareIssuesResponseDto
            {
                CaseId = caseId,
                ContextSnapshotId = snapshotId,
                Issues = dtoIssues
            };
        }

        private static IssueDto MapIssueToDto(Issue issue)
        {
            return new IssueDto
            {
                IssueId = issue.IssueId,
                Title = issue.Title,
                Description = issue.Description,
                Severity = issue.Severity,
                RecommendationSummary = issue.RecommendationSummary
            };
        }
    }
}
