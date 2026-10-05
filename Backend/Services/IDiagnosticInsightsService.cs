using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsService
    {
        Task<IReadOnlyList<DiagnosticInsightDto>> GetDiagnosticInsightsAsync(Guid memberId);
    }
}
