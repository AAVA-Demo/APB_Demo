using System.Collections.Generic;
using System.Linq;
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

        public async Task<IEnumerable<RecommendationDto>> GetRecommendationsAsync(string caseId, RecommendationContextRequest request)
        {
            var entities = await _repository.GetRecommendationsAsync(caseId, request.MemberId);

            return entities
                .OrderByDescending(r => r.Priority)
                .Select(r => new RecommendationDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    Priority = r.Priority
                })
                .ToList();
        }
    }
}
