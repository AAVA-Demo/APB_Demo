using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class DiagnosticInsightOutcomeService : IDiagnosticInsightOutcomeService
    {
        private readonly IDiagnosticOutcomeRepository _repository;

        public DiagnosticInsightOutcomeService(IDiagnosticOutcomeRepository repository)
        {
            _repository = repository;
        }

        public async Task<DiagnosticOutcomeDto> RecordResolutionOutcome(
            string caseId,
            string insightId,
            bool isResolved,
            string comment,
            string recordedBy)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new ValidationException("CaseId is required.");
            }

            if (string.IsNullOrWhiteSpace(insightId))
            {
                throw new ValidationException("InsightId is required.");
            }

            if (string.IsNullOrWhiteSpace(recordedBy))
            {
                throw new ValidationException("RecordedBy is required.");
            }

            if (comment != null && comment.Length > 500)
            {
                throw new ValidationException("Comment must not exceed 500 characters.");
            }

            var exists = await _repository.ExistsAsync(caseId, insightId);
            if (exists)
            {
                throw new DuplicateOutcomeException();
            }

            var outcome = new DiagnosticOutcome
            {
                CaseId = caseId,
                InsightId = insightId,
                IsResolved = isResolved,
                Comment = comment ?? string.Empty,
                RecordedBy = recordedBy,
                RecordedAt = DateTime.UtcNow
            };

            await _repository.SaveAsync(outcome);

            return new DiagnosticOutcomeDto
            {
                CaseId = outcome.CaseId,
                InsightId = outcome.InsightId,
                IsResolved = outcome.IsResolved,
                Comment = outcome.Comment,
                RecordedBy = outcome.RecordedBy,
                RecordedAt = outcome.RecordedAt
            };
        }
    }
}
