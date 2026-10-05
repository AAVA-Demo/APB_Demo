using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRemediationRepository
    {
        Task<IList<RemediationStepEntity>> GetStepsByInsightIdAsync(Guid insightId);
    }
}
