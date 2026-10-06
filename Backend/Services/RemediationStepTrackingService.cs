using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
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

        public async Task<RemediationStepStatusListDto> GetRemediationStepStatusAsync(string caseId, string issueId)
        {
            var steps = await _repository.GetStepStatusesAsync(caseId, issueId);
            var dto = new RemediationStepStatusListDto
            {
                CaseId = caseId,
                IssueId = issueId,
                Steps = steps.Select(MapToDto).OrderBy(s => s.StepOrder).ToList()
            };
            return dto;
        }

        public async Task<RemediationStepStatusDto> MarkRemediationStepCompletedAsync(string caseId, string issueId, string stepId, string completedBy)
        {
            var status = await _repository.GetStepStatusAsync(caseId, issueId, stepId);
            if (status == null)
            {
                throw new StepNotFoundException();
            }

            status.IsCompleted = true;
            status.CompletedBy = completedBy;
            status.CompletedAtUtc = DateTime.UtcNow;
            await _repository.SaveStepStatusAsync(status);
            return MapToDto(status);
        }

        private static RemediationStepStatusDto MapToDto(RemediationStepStatus status)
        {
            return new RemediationStepStatusDto
            {
                StepId = status.StepId,
                StepOrder = status.StepOrder,
                Title = status.Title,
                IsCompleted = status.IsCompleted,
                CompletedBy = status.CompletedBy,
                CompletedAtUtc = status.CompletedAtUtc
            };
        }
    }
}
