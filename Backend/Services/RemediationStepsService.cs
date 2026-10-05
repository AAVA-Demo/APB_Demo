using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RemediationStepsService : IRemediationStepsService
    {
        private readonly IRemediationStepsRepository _repository;

        public RemediationStepsService(IRemediationStepsRepository repository)
        {
            _repository = repository;
        }

        public Task<List<RemediationStepDto>> GetRemediationStepsAsync(Guid issueId)
        {
            return _repository.GetRemediationStepsAsync(issueId);
        }
    }
}
