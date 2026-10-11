using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class ResolutionSuggestionService : IResolutionSuggestionService
    {
        private readonly IResolutionRepository _resolutionRepository;
        private readonly IResolutionRankingStrategy _rankingStrategy;

        public ResolutionSuggestionService(IResolutionRepository resolutionRepository, IResolutionRankingStrategy rankingStrategy)
        {
            _resolutionRepository = resolutionRepository;
            _rankingStrategy = rankingStrategy;
        }

        public async Task<CaseResolutionsDto> GetPrioritizedResolutionsAsync(string caseId)
        {
            var options = await _resolutionRepository.GetOptionsAsync(caseId);
            if (options == null || options.Count == 0)
            {
                throw new CaseNotFoundException();
            }

            var ranked = _rankingStrategy.Rank(options);
            var rank = 1;

            var suggestions = ranked.Select(o => new ResolutionSuggestionDto
            {
                Id = o.Id,
                Text = o.Text,
                ExpectedResolutionTimeMinutes = o.EstimatedTimeMinutes,
                SuccessProbability = o.SuccessProbability,
                Rank = rank,
                IsTopSuggestion = rank++ == 1
            }).ToList();

            return new CaseResolutionsDto
            {
                CaseId = caseId,
                Resolutions = suggestions
            };
        }
    }
}
