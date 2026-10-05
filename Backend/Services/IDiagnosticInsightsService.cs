using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsService
    {
        Task<IList<InsightDto>> GetInsightsAsync(Guid issueId);
        Task<bool> TriggerRefreshAsync(Guid issueId, string triggerSource);
    }
}
