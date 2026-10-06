using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class IdentifiedIssueRepository : IIdentifiedIssueRepository
    {
        private readonly AppDbContext _context;

        public IdentifiedIssueRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IdentifiedIssue?> GetByMemberIssueIdAsync(string memberIssueId)
        {
            return await _context.IdentifiedIssues.FirstOrDefaultAsync(x => x.Id == memberIssueId);
        }
    }
}
