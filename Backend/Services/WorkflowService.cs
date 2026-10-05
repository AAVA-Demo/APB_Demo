using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class WorkflowService : IWorkflowService
    {
        private readonly IWorkflowRepository _repository;

        public WorkflowService(IWorkflowRepository repository)
        {
            _repository = repository;
        }

        public async Task<WorkflowDto?> GetWorkflowAsync(string issueId, string agentId)
        {
            var workflow = await _repository.GetWorkflowByIssueAsync(issueId);
            if (workflow == null)
            {
                return null;
            }

            return MapToDto(workflow, issueId, agentId);
        }

        public async Task<WorkflowDto?> CompleteStepAsync(string issueId, Guid stepId, string agentId, CompleteStepRequest request)
        {
            var workflow = await _repository.GetWorkflowByIssueAsync(issueId);
            if (workflow == null)
            {
                return null;
            }

            var step = workflow.Steps.FirstOrDefault(s => s.Id == stepId);
            if (step == null)
            {
                return null;
            }

            var completion = new WorkflowStepCompletion
            {
                Id = Guid.NewGuid(),
                IssueId = issueId,
                StepId = stepId,
                AgentId = agentId,
                IsCompleted = true,
                CompletedAt = request.CompletedAt ?? DateTime.UtcNow
            };

            await _repository.SaveStepCompletionAsync(completion);
            return MapToDto(workflow, issueId, agentId);
        }

        private WorkflowDto MapToDto(Workflow workflow, string issueId, string agentId)
        {
            var steps = workflow.Steps
                .OrderBy(s => s.Order)
                .ToList();

            var stepDtos = steps.Select(s => new WorkflowStepDto
            {
                Id = s.Id,
                Order = s.Order,
                Title = s.Title,
                Description = s.Description,
                IsCompleted = false
            }).ToList();

            var currentIndex = stepDtos.FindIndex(s => !s.IsCompleted);
            if (currentIndex < 0)
            {
                currentIndex = stepDtos.Count - 1;
            }

            return new WorkflowDto
            {
                Id = workflow.Id,
                IssueId = workflow.IssueId,
                Name = workflow.Name,
                Steps = stepDtos,
                CurrentStepIndex = currentIndex < 0 ? 0 : currentIndex,
                TotalSteps = stepDtos.Count
            };
        }
    }
}
