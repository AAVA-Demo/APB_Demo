using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IRecommendedActionsRepository
    {
        Task<List<RecommendedActionDto>> GetRecommendedActionsAsync(Guid issueId);
    }
}
