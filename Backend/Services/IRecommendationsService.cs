using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRecommendationsService
    {
        Task<IEnumerable<RecommendationDto>> GetRecommendationsAsync(string caseId, RecommendationContextRequest request);
    }
}
