using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class InsightRefreshService : IInsightRefreshService
    {
        private readonly IInsightRepository _repository;
        private readonly IInsightRefreshHub _hub;
        private readonly IInsightEngine _engine;

        public InsightRefreshService(
            IInsightRepository repository,
            IInsightRefreshHub hub,
            IInsightEngine engine)
        {
            _repository = repository;
            _hub = hub;
            _engine = engine;
        }

        public async Task<CurrentInsightsDto> GetCurrentInsights(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                throw new ValidationException("CaseId is required.");
            }

            var insights = await _repository.GetByCaseIdAsync(caseId);
            if (insights.Count == 0)
            {
                throw new CaseNotFoundException();
            }

            var lastUpdatedAt = DateTime.UtcNow;
            var dto = new CurrentInsightsDto
            {
                CaseId = caseId,
                LastUpdatedAt = lastUpdatedAt,
                Insights = insights.Select(x => new InsightDto
                {
                    InsightId = x.InsightId,
                    Title = x.Title,
                    Summary = x.Summary,
                    Priority = x.Priority
                }).ToList()
            };

            return dto;
        }

        public async Task HandleCaseEventAsync(CaseEvent caseEvent)
        {
            if (string.IsNullOrWhiteSpace(caseEvent.CaseId))
            {
                throw new ValidationException("CaseId is required.");
            }

            if (string.IsNullOrWhiteSpace(caseEvent.EventType))
            {
                throw new ValidationException("EventType is required.");
            }

            var insights = _engine.GenerateInsights(caseEvent.CaseId);
            var lastUpdatedAt = DateTime.UtcNow;

            await _repository.SaveInsightsAsync(caseEvent.CaseId, insights, lastUpdatedAt);

            var dto = new CurrentInsightsDto
            {
                CaseId = caseEvent.CaseId,
                LastUpdatedAt = lastUpdatedAt,
                Insights = insights.Select(x => new InsightDto
                {
                    InsightId = x.InsightId,
                    Title = x.Title,
                    Summary = x.Summary,
                    Priority = x.Priority
                }).ToList()
            };

            await _hub.SendInsightsUpdated(caseEvent.CaseId, dto);
        }
    }
}
