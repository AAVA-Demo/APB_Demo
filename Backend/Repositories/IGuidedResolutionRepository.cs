using System;
using System;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IGuidedResolutionRepository
    {
        Task<GuidedResolutionWorkflowEntity> GetOrCreateWorkflowAsync(Guid issueId);
        Task<GuidedResolutionWorkflowEntity?> GetWorkflowAsync(Guid issueId);
        Task<GuidedResolutionWorkflowEntity> UpdateStepStatusAsync(Guid issueId, Guid stepId, string newStatus);
    }
}
