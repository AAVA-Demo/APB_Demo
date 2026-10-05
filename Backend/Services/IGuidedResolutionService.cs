using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IGuidedResolutionService
    {
        Task<GuidedResolutionWorkflowDto?> GetWorkflowAsync(Guid issueId);
        Task<GuidedResolutionWorkflowDto> UpdateStepStatusAsync(Guid issueId, GuidedResolutionStepStatusUpdateDto updateDto);
    }
}
