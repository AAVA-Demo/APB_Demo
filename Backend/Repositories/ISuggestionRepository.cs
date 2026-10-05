using Backend.Models;

namespace Backend.Repositories
{
    public interface ISuggestionRepository
    {
        Task<List<Suggestion>> FindSuggestionsByMemberIdAsync(string memberId);
    }
}
