using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MemberRepository : IMemberRepository
    {
        private readonly AppDbContext _context;

        public MemberRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<Member?> GetByIdAsync(string memberId)
        {
            return _context.Members.FirstOrDefaultAsync(m => m.Id == memberId);
        }
    }
}
