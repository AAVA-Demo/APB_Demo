using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsService
    {
        Task<List<DiagnosticInsightDto>> GetDiagnosticInsightsAsync(Guid caseId);
    }
}
