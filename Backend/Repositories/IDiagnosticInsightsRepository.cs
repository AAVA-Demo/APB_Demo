using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticInsightsRepository
    {
        Task<IList<InsightEntity>> GetInsightsByIssueAsync(Guid issueId);
        Task<bool> IssueExistsAsync(Guid issueId);
        Task SaveAsync();
    }
}
