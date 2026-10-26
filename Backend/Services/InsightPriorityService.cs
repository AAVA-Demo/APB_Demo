using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class InsightPriorityService : IInsightPriorityService
    {
        private readonly IInsightRepository _repository;

        public InsightPriorityService(IInsightRepository repository)
        {
            _repository = repository;
        }

        public async Task<InsightListDto> GetPrioritizedInsights(string caseId)
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

            foreach (var insight in insights)
            {
                if (insight.Priority != "High" &&
                    insight.Priority != "Medium" &&
                    insight.Priority != "Low")
                {
                    throw new ValidationException("Invalid priority value.");
                }
            }

            var ordered = insights
                .OrderByDescending(x => x.Priority == "High")
                .ThenByDescending(x => x.Priority == "Medium")
                .ThenBy(x => x.InsightId)
                .ToList();

            var dto = new InsightListDto
            {
                CaseId = caseId,
                Insights = ordered.Select(x => new InsightDto
                {
                    InsightId = x.InsightId,
                    Title = x.Title,
                    Summary = x.Summary,
                    Priority = x.Priority
                }).ToList()
            };

            return dto;
        }
    }
}
