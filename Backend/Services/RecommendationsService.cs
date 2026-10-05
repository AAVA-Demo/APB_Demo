using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RecommendationsService : IRecommendationsService
    {
        private readonly IRecommendationsRepository _repository;

        public RecommendationsService(IRecommendationsRepository repository)
        {
            _repository = repository;
        }

        public Task<List<RecommendationDto>> GetRecommendationsAsync(Guid issueId)
        {
            return _repository.GetRecommendationsAsync(issueId);
        }
    }
}
