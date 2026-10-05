using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationService
    {
        Task<IList<RemediationStepDto>> GetRemediationStepsAsync(Guid insightId);
    }
}
