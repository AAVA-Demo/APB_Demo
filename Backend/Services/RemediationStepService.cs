using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationStepService : IRemediationStepService
    {
        private readonly IRemediationStepRepository _repository;

        public RemediationStepService(IRemediationStepRepository repository)
        {
            _repository = repository;
        }

        public async Task<RemediationStepsDto> GetRemediationSteps(string caseId, string insightId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new ValidationException("CaseId is required.");
            }

            if (string.IsNullOrWhiteSpace(insightId))
            {
                throw new ValidationException("InsightId is required.");
            }

            var steps = await _repository.GetByInsightAsync(caseId, insightId);
            if (steps.Count == 0)
            {
                throw new RemediationStepsNotFoundException();
            }

            var dto = new RemediationStepsDto
            {
                CaseId = caseId,
                InsightId = insightId,
                Steps = steps.Select(x => new RemediationStepDto
                {
                    StepOrder = x.StepOrder,
                    Description = x.Description
                }).ToList()
            };

            return dto;
        }
    }
}
