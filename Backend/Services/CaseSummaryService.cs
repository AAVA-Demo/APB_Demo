using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class CaseSummaryService : ICaseSummaryService
    {
        private readonly ICaseSummaryRepository _repository;

        public CaseSummaryService(ICaseSummaryRepository repository)
        {
            _repository = repository;
        }

        public Task<CaseSummaryDto?> GetCaseSummaryAsync(Guid caseId)
        {
            return _repository.GetCaseSummaryDataAsync(caseId);
        }
    }
}
