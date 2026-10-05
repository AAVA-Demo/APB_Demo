using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
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

        public async Task<IReadOnlyList<DiagnosticInsightDto>> GetDiagnosticInsightsAsync(Guid memberId)
        {
            var entities = await _repository.GetInsightsForMemberAsync(memberId);

            return entities
                .OrderBy(e => e.GeneratedAt)
                .Select(e => new DiagnosticInsightDto
                {
                    Id = e.Id,
                    Category = e.Category,
                    Description = e.Description,
                    Severity = e.Severity,
                    GeneratedAt = e.GeneratedAt
                })
                .ToList();
        }
    }
}
