using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class RecommendedActionsService : IRecommendedActionsService
    {
        private readonly IRecommendedActionsRepository _repository;

        public RecommendedActionsService(IRecommendedActionsRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<RecommendedActionDto>> GetRecommendedActionsAsync(Guid issueId)
        {
            var actions = await _repository.GetRecommendedActionsAsync(issueId);
            return actions
                .OrderBy(a => a.PriorityRank)
                .ThenByDescending(a => a.ImpactScore)
                .ToList();
        }
    }
}
