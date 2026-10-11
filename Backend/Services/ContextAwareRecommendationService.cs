using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class ContextAwareRecommendationService : IContextAwareRecommendationService
    {
        private readonly ICaseContextService _caseContextService;
        private readonly IRecommendationRepository _recommendationRepository;

        public ContextAwareRecommendationService(ICaseContextService caseContextService, IRecommendationRepository recommendationRepository)
        {
            _caseContextService = caseContextService;
            _recommendationRepository = recommendationRepository;
        }

        public async Task<ContextAwareRecommendationsDto> GetContextAwareRecommendationsAsync(string caseId)
        {
            var context = await _caseContextService.GetCaseContextAsync(caseId);
            if (context == null)
            {
                throw new CaseNotFoundException();
            }

            if (context.Symptoms == null || context.Symptoms.Count == 0)
            {
                throw new CaseContextUnavailableException();
            }

            var patterns = await _recommendationRepository.GetPatternsAsync();

            var recommendations = patterns.Select(p => new RecommendationDto
            {
                Id = p.Id,
                Text = p.TemplateText.Replace("{symptom}", context.Symptoms[0]),
                ReferencedSymptoms = context.Symptoms,
                ReferencedInteractions = context.RecentInteractionsList
            }).ToList();

            return new ContextAwareRecommendationsDto
            {
                CaseId = caseId,
                Symptoms = context.Symptoms,
                RecentInteractions = context.RecentInteractionsList,
                Recommendations = recommendations
            };
        }
    }
}
