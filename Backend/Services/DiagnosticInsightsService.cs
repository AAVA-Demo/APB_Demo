using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightsService : IDiagnosticInsightsService
    {
        private readonly IDiagnosticInsightsRepository _repository;

        public DiagnosticInsightsService(IDiagnosticInsightsRepository repository)
        {
            _repository = repository;
        }

        public Task<List<DiagnosticInsightDto>> GetDiagnosticInsightsAsync(Guid caseId)
        {
            return _repository.GetCaseInsightsAsync(caseId);
        }
    }
}
