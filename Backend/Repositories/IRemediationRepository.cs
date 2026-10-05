using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationRepository
    {
        Task<List<RemediationStep>> GetStepsForMemberAsync(Guid memberId);
        Task<List<RemediationStep>> GetOrCreateStepsAsync(Guid memberId, IReadOnlyList<string> rootCauses);
        Task<RemediationStep?> GetStepAsync(Guid memberId, Guid stepId);
        Task SaveAsync(RemediationStep step);
    }
}
