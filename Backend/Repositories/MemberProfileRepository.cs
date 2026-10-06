using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MemberProfileRepository : IMemberProfileRepository
    {
        private readonly AppDbContext _context;

        public MemberProfileRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MemberProfile?> GetByIdAsync(string id)
        {
            return await _context.MemberProfiles.FindAsync(id);
        }
    }
}
