using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationInstructionsRepository : IRemediationInstructionsRepository
    {
        private readonly AppDbContext _context;

        public RemediationInstructionsRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<RemediationInstruction>> GetInstructionsByIssueId(string issueId)
        {
            return _context.RemediationInstructions.Where(r => r.IssueId == issueId).OrderBy(r => r.Order).ToListAsync();
        }

        public async Task SaveInstructions(string issueId, List<RemediationInstruction> instructions)
        {
            var existing = _context.RemediationInstructions.Where(r => r.IssueId == issueId);
            _context.RemediationInstructions.RemoveRange(existing);
            await _context.RemediationInstructions.AddRangeAsync(instructions);
            await _context.SaveChangesAsync();
        }
    }
}
