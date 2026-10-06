using System.Collections.Generic;
using System.Threading.Tasks;
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

        public async Task<MemberIssue?> GetByIdAsync(string id)
        {
            return await _context.MemberIssues.FindAsync(id);
        }

        public async Task<List<MemberIssue>> GetAllAsync()
        {
            return await _context.MemberIssues.ToListAsync();
        }
    }
}
