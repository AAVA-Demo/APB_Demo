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
        private readonly IRealTimeUpdatePublisher _publisher;

        public DiagnosticInsightsService(IDiagnosticInsightsRepository repository, IRealTimeUpdatePublisher publisher)
        {
            _repository = repository;
            _publisher = publisher;
        }

        public async Task<IList<InsightDto>> GetInsightsAsync(Guid issueId)
        {
            var entities = await _repository.GetInsightsByIssueAsync(issueId);

            foreach (var entity in entities)
            {
                entity.ConfidenceBand = MapBand(entity.ConfidenceScore);
            }

            return entities
                .OrderByDescending(e => e.Priority)
                .ThenByDescending(e => e.CreatedAt)
                .Select(MapToDto)
                .ToList();
        }

        public async Task<bool> TriggerRefreshAsync(Guid issueId, string triggerSource)
        {
            var exists = await _repository.IssueExistsAsync(issueId);
            if (!exists)
            {
                return false;
            }

            var insights = await GetInsightsAsync(issueId);
            await _publisher.PublishInsightsAsync(issueId, insights);
            return true;
        }

        private static InsightDto MapToDto(InsightEntity entity)
        {
            return new InsightDto
            {
                Id = entity.Id,
                IssueId = entity.IssueId,
                Title = entity.Title,
                Summary = entity.Summary,
                Details = entity.Details,
                Priority = entity.Priority,
                CreatedAt = entity.CreatedAt,
                Source = entity.Source,
                Description = entity.Description,
                Recommendation = entity.Recommendation,
                ConfidenceScore = entity.ConfidenceScore,
                ConfidenceBand = entity.ConfidenceBand,
                UpdatedAt = entity.UpdatedAt
            };
        }

        private static string MapBand(double score)
        {
            if (score >= 0.75) return "High";
            if (score >= 0.5) return "Medium";
            return "Low";
        }
    }
}
