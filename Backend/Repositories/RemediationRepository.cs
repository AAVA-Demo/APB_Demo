using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationRepository : IRemediationRepository
    {
        private readonly AppDbContext _context;

        public RemediationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RemediationStep>> GetStepsAsync(string issueId)
        {
            return await _context.RemediationSteps
                .Where(s => s.IssueId == issueId)
                .OrderBy(s => s.Order)
                .ToListAsync();
        }
    }
}
