using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class SuggestionRepository : ISuggestionRepository
    {
        private readonly AppDbContext _context;

        public SuggestionRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<Suggestion>> FindSuggestionsByMemberIdAsync(string memberId)
        {
            return _context.Suggestions.Where(s => s.MemberId == memberId).ToListAsync();
        }
    }
}
