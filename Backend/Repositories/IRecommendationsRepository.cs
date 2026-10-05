using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IRecommendationsRepository
    {
        Task<List<Recommendation>> GetRecommendationsAsync(Guid memberId);
    }
}
