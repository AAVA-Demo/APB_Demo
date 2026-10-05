using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MemberInteractionRepository : IMemberInteractionRepository
    {
        private readonly AppDbContext _context;

        public MemberInteractionRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<MemberInteraction>> FindByMemberIdAsync(string memberId)
        {
            return _context.MemberInteractions.Where(i => i.MemberId == memberId).ToListAsync();
        }
    }
}
