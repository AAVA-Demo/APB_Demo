using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IDiagnosticInsightsRepository
    {
        Task<List<DiagnosticInsightDto>> GetCaseInsightsAsync(Guid caseId);
    }
}
