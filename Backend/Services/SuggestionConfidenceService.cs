using System.Text.RegularExpressions;
using Backend.Dtos;
using Backend.Repositories;

namespace Backend.Services
{
    public class SuggestionConfidenceService : ISuggestionConfidenceService
    {
        private readonly ISuggestionRepository _repository;
        private readonly SuggestionConfidenceEngine _engine;

        public SuggestionConfidenceService(ISuggestionRepository repository, SuggestionConfidenceEngine engine)
        {
            _repository = repository;
            _engine = engine;
        }

        public async Task<SuggestionConfidenceResponse> GetSuggestionsWithConfidenceAsync(string memberId)
        {
            if (string.IsNullOrWhiteSpace(memberId))
            {
                throw new ArgumentException("memberId is required");
            }

            if (!Regex.IsMatch(memberId, "^[A-Za-z0-9\\-]+$"))
            {
                throw new ArgumentException("memberId format is invalid");
            }

            var suggestions = await _repository.FindSuggestionsByMemberIdAsync(memberId);
            var dtoList = new List<SuggestionConfidenceDto>();

            foreach (var suggestion in suggestions)
            {
                var score = _engine.CalculateConfidenceScore(suggestion);
                var level = _engine.DeriveConfidenceLevel(score);
                dtoList.Add(new SuggestionConfidenceDto
                {
                    SuggestionId = suggestion.Id,
                    Description = suggestion.Description,
                    ConfidenceScore = score,
                    ConfidenceLevel = level
                });
            }

            return new SuggestionConfidenceResponse
            {
                MemberId = memberId,
                Suggestions = dtoList
            };
        }
    }
}
