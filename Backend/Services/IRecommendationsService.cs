using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRecommendationsService
    {
        Task<IReadOnlyList<RecommendationDto>> GetRecommendationsAsync(Guid memberId);
    }
}
