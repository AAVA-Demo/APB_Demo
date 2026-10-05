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

        public async Task<IEnumerable<RemediationStepDto>> GetRemediationStepsAsync(string issueId)
        {
            var steps = await _repository.GetStepsAsync(issueId);
            return steps
                .OrderBy(s => s.Order)
                .Select(s => new RemediationStepDto
                {
                    Id = s.Id,
                    Order = s.Order,
                    Title = s.Title,
                    Description = s.Description
                })
                .ToList();
        }
    }
}
