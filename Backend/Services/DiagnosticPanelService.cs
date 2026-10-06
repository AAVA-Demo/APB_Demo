using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;
using Backend.Models;

namespace Backend.Services
{
    public class DiagnosticPanelService : IDiagnosticPanelService
    {
        private readonly IDiagnosticPanelConfigRepository _diagnosticPanelConfigRepository;
        private readonly IMemberIssueRepository _memberIssueRepository;

        public DiagnosticPanelService(IDiagnosticPanelConfigRepository diagnosticPanelConfigRepository, IMemberIssueRepository memberIssueRepository)
        {
            _diagnosticPanelConfigRepository = diagnosticPanelConfigRepository;
            _memberIssueRepository = memberIssueRepository;
        }

        public async Task<DiagnosticPanelContextDto> GetPanelContext(string memberIssueId, string agentId)
        {
            if (string.IsNullOrWhiteSpace(memberIssueId))
            {
                throw new DiagnosticPanelServiceValidationException("Member issue identifier is required.");
            }

            if (string.IsNullOrWhiteSpace(agentId))
            {
                throw new DiagnosticPanelServiceValidationException("Authenticated agent is required.");
            }

            var issue = await _memberIssueRepository.GetByIdAsync(memberIssueId);
            if (issue == null)
            {
                throw new MemberIssueNotFoundException("Member issue not found.");
            }

            var config = await _diagnosticPanelConfigRepository.GetByWorkspaceIdAsync(issue.WorkspaceId);
            if (config == null)
            {
                throw new PanelUnavailableException("Diagnostic panel is not available for this issue.");
            }

            var dto = new DiagnosticPanelContextDto
            {
                MemberIssueId = memberIssueId,
                IsPanelAvailable = true,
                PanelTitle = config.Title,
                PanelSections = config.Sections.Select(s => new PanelSectionDto
                {
                    SectionKey = s.SectionKey,
                    DisplayName = s.DisplayName
                }).ToList()
            };

            return dto;
        }
    }
}
