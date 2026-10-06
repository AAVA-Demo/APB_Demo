using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class ContextAwareRecommendationService : IContextAwareRecommendationService
    {
        private readonly ICaseContextRepository _caseContextRepository;
        private readonly IAiEngineClient _aiEngineClient;

        public ContextAwareRecommendationService(ICaseContextRepository caseContextRepository, IAiEngineClient aiEngineClient)
        {
            _caseContextRepository = caseContextRepository;
            _aiEngineClient = aiEngineClient;
        }

        public async Task<RecommendationSetDto> GetContextAwareRecommendationsAsync(string caseId)
        {
            var context = await _caseContextRepository.GetCaseContextAsync(caseId);
            if (context == null)
            {
                throw new CaseNotFoundException();
            }

            var result = await _aiEngineClient.GetRecommendationsAsync(context);
            if (result == null || result.Items == null)
            {
                throw new RecommendationUnavailableException();
            }

            var dto = new RecommendationSetDto
            {
                CaseId = result.CaseId,
                MemberId = result.MemberId,
                Recommendations = result.Items.Select(i => new RecommendationDto
                {
                    Code = i.Code,
                    Title = i.Title,
                    Description = i.Description,
                    Priority = i.Priority
                }).ToList()
            };

            return dto;
        }
    }
}
