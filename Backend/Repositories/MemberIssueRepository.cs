using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MemberIssueRepository : IMemberIssueRepository
    {
        private readonly AppDbContext _context;

        public MemberIssueRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<MemberIssue>> FindActiveIssuesByMemberIdAsync(string memberId)
        {
            return _context.MemberIssues.Where(i => i.MemberId == memberId).ToListAsync();
        }

        public Task<List<MemberRecommendation>> FindRecommendationsByMemberIdAsync(string memberId)
        {
            return _context.MemberRecommendations.Where(r => r.MemberId == memberId).ToListAsync();
        }
    }
}
