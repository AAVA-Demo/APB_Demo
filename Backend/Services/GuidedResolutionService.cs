using System;
using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class GuidedResolutionService : IGuidedResolutionService
    {
        private readonly IGuidedResolutionRepository _repository;

        public GuidedResolutionService(IGuidedResolutionRepository repository)
        {
            _repository = repository;
        }

        public async Task<GuidedResolutionWorkflowDto?> GetWorkflowAsync(Guid issueId)
        {
            var entity = await _repository.GetOrCreateWorkflowAsync(issueId);
            return MapToDto(entity);
        }

        public async Task<GuidedResolutionWorkflowDto> UpdateStepStatusAsync(Guid issueId, GuidedResolutionStepStatusUpdateDto updateDto)
        {
            var stepId = Guid.Parse(updateDto.StepId);
            var entity = await _repository.UpdateStepStatusAsync(issueId, stepId, updateDto.NewStatus);
            return MapToDto(entity);
        }

        private GuidedResolutionWorkflowDto MapToDto(Backend.Models.GuidedResolutionWorkflowEntity entity)
        {
            var dto = new GuidedResolutionWorkflowDto
            {
                IssueId = entity.IssueId.ToString(),
                Status = entity.Status
            };
            dto.Steps = entity.Steps
                .OrderBy(s => s.Order)
                .Select(s => new GuidedResolutionStepDto
                {
                    Id = s.Id.ToString(),
                    Order = s.Order,
                    Title = s.Title,
                    Description = s.Description ?? string.Empty,
                    Status = s.Status
                })
                .ToList();
            return dto;
        }
    }
}
