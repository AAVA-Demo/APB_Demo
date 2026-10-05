using Backend.Dtos;

namespace Backend.Services
{
    public interface ISuggestionConfidenceService
    {
        Task<SuggestionConfidenceResponse> GetSuggestionsWithConfidenceAsync(string memberId);
    }
}
