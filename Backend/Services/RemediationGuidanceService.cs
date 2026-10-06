using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;
using Backend.Models;

namespace Backend.Services
{
    public class RemediationGuidanceService : IRemediationGuidanceService
    {
        private readonly IIssueIdentificationService _issueIdentificationService;
        private readonly IRemediationTemplateRepository _remediationTemplateRepository;

        public RemediationGuidanceService(IIssueIdentificationService issueIdentificationService, IRemediationTemplateRepository remediationTemplateRepository)
        {
            _issueIdentificationService = issueIdentificationService;
            _remediationTemplateRepository = remediationTemplateRepository;
        }

        public async Task<RemediationGuidanceDto> GetGuidance(string memberIssueId, string agentId)
        {
            if (string.IsNullOrWhiteSpace(memberIssueId))
            {
                throw new RemediationGuidanceServiceValidationException("Member issue identifier is required.");
            }

            if (string.IsNullOrWhiteSpace(agentId))
            {
                throw new RemediationGuidanceServiceValidationException("Authenticated agent is required.");
            }

            var identifiedIssue = await _issueIdentificationService.GetIdentifiedIssue(memberIssueId);
            if (identifiedIssue == null)
            {
                throw new MemberIssueNotFoundException("Member issue not found.");
            }

            var templates = await _remediationTemplateRepository.GetByIssueCodeAsync(identifiedIssue.IssueCode);
            var ordered = templates.OrderBy(t => t.StepNumber).ToList();
            if (!ordered.Any())
            {
                throw new RemediationGuidanceNotAvailableException("Remediation guidance is not available for this issue.");
            }

            var dto = new RemediationGuidanceDto
            {
                MemberIssueId = memberIssueId,
                IssueSummary = identifiedIssue.Summary,
                Steps = ordered.Select(t => new RemediationStepDto
                {
                    StepNumber = t.StepNumber,
                    Title = t.Title,
                    Instruction = t.Instruction
                }).ToList()
            };

            return dto;
        }
    }
}
