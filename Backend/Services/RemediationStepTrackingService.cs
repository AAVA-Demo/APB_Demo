using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationStepTrackingService : IRemediationStepTrackingService
    {
        private readonly IRemediationStepRepository _repository;

        public RemediationStepTrackingService(IRemediationStepRepository repository)
        {
            _repository = repository;
        }

        public async Task<RemediationStepListResponse> GetRemediationStepsAsync(string issueId)
        {
            if (string.IsNullOrWhiteSpace(issueId))
            {
                throw new ArgumentException("issueId is required");
            }

            var steps = await _repository.FindStepsByIssueIdAsync(issueId);
            var ordered = steps.OrderBy(s => s.OrderIndex).ToList();
            var nextStep = ordered.FirstOrDefault(s => !s.Completed);

            return new RemediationStepListResponse
            {
                IssueId = issueId,
                Steps = ordered.Select(s => new RemediationStepDto
                {
                    StepId = s.Id,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex,
                    Completed = s.Completed
                }).ToList(),
                NextStepId = nextStep?.Id
            };
        }

        public async Task<RemediationStepUpdateResponse> CompleteRemediationStepAsync(string issueId, string stepId, RemediationStepCompleteRequest request)
        {
            if (string.IsNullOrWhiteSpace(issueId))
            {
                throw new ArgumentException("issueId is required");
            }

            if (string.IsNullOrWhiteSpace(stepId))
            {
                throw new ArgumentException("stepId is required");
            }

            var updated = await _repository.UpdateStepCompletionAsync(issueId, stepId, request.CompletedBy);
            if (updated == null)
            {
                throw new InvalidOperationException("RemediationStepNotFoundException");
            }

            var list = await GetRemediationStepsAsync(issueId);

            return new RemediationStepUpdateResponse
            {
                IssueId = issueId,
                StepId = stepId,
                Completed = updated.Completed,
                NextStepId = list.NextStepId
            };
        }
    }
}
