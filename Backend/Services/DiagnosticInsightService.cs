using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightService : IDiagnosticInsightService
    {
        private readonly IDiagnosticInsightRepository _repository;

        public DiagnosticInsightService(IDiagnosticInsightRepository repository)
        {
            _repository = repository;
        }

        public async Task<DiagnosticInsightListDto> GetDiagnosticInsights(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new ValidationException("CaseId is required.");
            }

            var insights = await _repository.GetByCaseIdAsync(caseId);
            if (insights.Count == 0)
            {
                return new DiagnosticInsightListDto
                {
                    CaseId = caseId,
                    Insights = new()
                };
            }

            var dto = new DiagnosticInsightListDto
            {
                CaseId = caseId,
                Insights = insights.Select(x => new DiagnosticInsightDto
                {
                    InsightId = x.InsightId,
                    Title = x.Title,
                    Summary = x.Summary
                }).ToList()
            };

            return dto;
        }
    }
}
