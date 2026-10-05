using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class IssueRepository : IIssueRepository
    {
        private readonly AppDbContext _context;

        public IssueRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Issue>> GetActiveIssuesAsync()
        {
            return await _context.Issues
                .Where(i => i.Status == "Active")
                .ToListAsync();
        }

        public Task<Issue?> GetIssueAsync(string issueId)
        {
            return _context.Issues.FirstOrDefaultAsync(i => i.Id == issueId);
        }
    }
}
