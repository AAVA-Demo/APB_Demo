using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationStepsService
    {
        Task<List<RemediationStepDto>> GetRemediationStepsAsync(Guid issueId);
    }
}
