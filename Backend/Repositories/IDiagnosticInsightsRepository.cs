using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticInsightsRepository
    {
        Task<IReadOnlyList<DiagnosticInsight>> GetInsightsForMemberAsync(Guid memberId);
    }
}
