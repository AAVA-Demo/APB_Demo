using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Services
{
    public class RemediationStepService : IRemediationStepService
    {
        private readonly IIssuePatternService _issuePatternService;
        private readonly IRemediationStepRepository _remediationStepRepository;

        public RemediationStepService(IIssuePatternService issuePatternService, IRemediationStepRepository remediationStepRepository)
        {
            _issuePatternService = issuePatternService;
            _remediationStepRepository = remediationStepRepository;
        }

        public async Task<CaseRemediationStepsDto> GetRemediationStepsAsync(string caseId)
        {
            var issuePatternId = await _issuePatternService.DetectIssuePatternAsync(caseId);
            if (issuePatternId == null)
            {
                throw new IssuePatternNotRecognizedException();
            }

            var steps = await _remediationStepRepository.GetStepsAsync(issuePatternId);
            if (steps.Count == 0)
            {
                throw new CaseNotFoundException();
            }

            var ordered = steps.OrderBy(s => s.StepNumber).ToList();
            EnsureSequentialSteps(ordered);

            return new CaseRemediationStepsDto
            {
                CaseId = caseId,
                IssuePatternId = issuePatternId,
                Steps = ordered.Select(s => new RemediationStepDto
                {
                    StepNumber = s.StepNumber,
                    Title = s.Title,
                    Description = s.Description
                }).ToList()
            };
        }

        private static void EnsureSequentialSteps(List<RemediationStep> steps)
        {
            var current = 1;
            var seen = new System.Collections.Generic.HashSet<int>();
            foreach (var step in steps)
            {
                if (step.StepNumber <= 0 || !seen.Add(step.StepNumber))
                {
                    throw new System.InvalidOperationException("StepNumber must be positive and unique.");
                }

                step.StepNumber = current++;
            }
        }
    }
}
