using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationGuidanceService : IRemediationGuidanceService
    {
        private readonly ICaseIssueRepository _caseIssueRepository;
        private readonly IAiEngineClient _aiEngineClient;

        public RemediationGuidanceService(ICaseIssueRepository caseIssueRepository, IAiEngineClient aiEngineClient)
        {
            _caseIssueRepository = caseIssueRepository;
            _aiEngineClient = aiEngineClient;
        }

        public async Task<RemediationGuidanceDto> GetIssueRemediationStepsAsync(string caseId, string issueId)
        {
            var issue = await _caseIssueRepository.GetIssueByIdAsync(caseId, issueId);
            if (issue == null)
            {
                throw new IssueNotFoundException();
            }

            var result = await _aiEngineClient.GetRemediationPlanAsync(issue);
            if (result == null || result.Steps == null)
            {
                throw new RemediationGuidanceUnavailableException();
            }

            var dto = new RemediationGuidanceDto
            {
                CaseId = result.CaseId,
                IssueId = result.IssueId,
                Steps = result.Steps.Select(s => new RemediationStepDto
                {
                    StepOrder = s.StepOrder,
                    Title = s.Title,
                    Description = s.Description,
                    EstimatedDurationMinutes = s.EstimatedDurationMinutes
                }).OrderBy(s => s.StepOrder).ToList()
            };

            return dto;
        }
    }
}
