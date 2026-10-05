using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationStepService : IRemediationStepService
    {
        private readonly IRemediationStepRepository _repository;
        private readonly RemediationStepEngine _engine;

        public RemediationStepService(IRemediationStepRepository repository, RemediationStepEngine engine)
        {
            _repository = repository;
            _engine = engine;
        }

        public async Task<RemediationStepResponse> GetRemediationStepsAsync(string memberId, string issueId)
        {
            if (string.IsNullOrWhiteSpace(memberId))
            {
                throw new ArgumentException("memberId is required");
            }

            if (string.IsNullOrWhiteSpace(issueId))
            {
                throw new ArgumentException("issueId is required");
            }

            var steps = await _repository.FindByMemberIdAndIssueIdAsync(memberId, issueId);
            var ordered = _engine.OrderSteps(steps);

            return new RemediationStepResponse
            {
                MemberId = memberId,
                IssueId = issueId,
                Steps = ordered.Select(s => new RemediationStepDto
                {
                    StepId = s.Id,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex,
                    Completed = s.Completed
                }).ToList()
            };
        }
    }
}
