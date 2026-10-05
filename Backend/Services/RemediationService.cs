using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationService : IRemediationService
    {
        private readonly IRemediationRepository _repository;

        public RemediationService(IRemediationRepository repository)
        {
            _repository = repository;
        }

        public async Task<IList<RemediationStepDto>> GetRemediationStepsAsync(Guid insightId)
        {
            var entities = await _repository.GetStepsByInsightIdAsync(insightId);
            return entities
                .OrderBy(s => s.Order)
                .Select(e => new RemediationStepDto
                {
                    Id = e.Id,
                    InsightId = e.InsightId,
                    Order = e.Order,
                    Title = e.Title,
                    Description = e.Description
                })
                .ToList();
        }
    }
}
