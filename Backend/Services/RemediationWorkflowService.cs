using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationWorkflowService : IRemediationWorkflowService
    {
        private readonly IRemediationWorkflowRepository _repository;

        public RemediationWorkflowService(IRemediationWorkflowRepository repository)
        {
            _repository = repository;
        }

        public async Task<WorkflowDto?> GetWorkflowAsync(System.Guid issueId)
        {
            var workflow = await _repository.GetWorkflowByIssueAsync(issueId);
            if (workflow == null)
            {
                return null;
            }

            var steps = await _repository.GetStepsByWorkflowAsync(workflow.Id);

            var dto = new WorkflowDto
            {
                Id = workflow.Id,
                IssueId = workflow.IssueId,
                Name = workflow.Name,
                Description = workflow.Description,
                Steps = steps
                    .OrderBy(s => s.Order)
                    .Select(s => new WorkflowStepDto
                    {
                        Id = s.Id,
                        Order = s.Order,
                        Title = s.Title,
                        Instruction = s.Instruction,
                        IsCompleted = s.IsCompleted
                    }).ToList()
            };

            return dto;
        }

        public async Task<WorkflowStepCompletionResult?> CompleteStepAsync(System.Guid issueId, System.Guid stepId, bool isCompleted)
        {
            var workflow = await _repository.GetWorkflowByIssueAsync(issueId);
            if (workflow == null)
            {
                return null;
            }

            var steps = await _repository.GetStepsByWorkflowAsync(workflow.Id);
            var step = steps.FirstOrDefault(s => s.Id == stepId);
            if (step == null)
            {
                return null;
            }

            var maxCompletedOrder = steps.Where(s => s.IsCompleted).Select(s => (int?)s.Order).Max() ?? 0;
            var expectedOrder = maxCompletedOrder + 1;
            var isOrderValid = step.Order == expectedOrder || (step.IsCompleted && step.Order <= maxCompletedOrder);

            if (!isOrderValid)
            {
                return new WorkflowStepCompletionResult
                {
                    IsOrderValid = false,
                    Workflow = await GetWorkflowAsync(issueId)
                };
            }

            step.IsCompleted = isCompleted;
            step.CompletedAt = isCompleted ? System.DateTime.UtcNow : null;
            await _repository.SaveAsync();

            return new WorkflowStepCompletionResult
            {
                IsOrderValid = true,
                Workflow = await GetWorkflowAsync(issueId)
            };
        }
    }
}
