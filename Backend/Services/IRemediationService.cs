using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationService
    {
        Task<IReadOnlyList<RemediationStepDto>> GetRemediationStepsAsync(Guid memberId);
        Task<RemediationStepDto?> UpdateRemediationStepStatusAsync(Guid memberId, Guid stepId, UpdateRemediationStepStatusRequest request);
    }
}
