using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ResolutionOutcomeRepository : IResolutionOutcomeRepository
    {
        private readonly AppDbContext _context;

        public ResolutionOutcomeRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<ResolutionOutcome?> GetByIssueAndAgentAsync(string issueId, string agentId)
        {
            return _context.ResolutionOutcomes
                .FirstOrDefaultAsync(o => o.IssueId == issueId && o.AgentId == agentId);
        }

        public Task<ResolutionOutcome?> GetByIssueAsync(string issueId)
        {
            return _context.ResolutionOutcomes
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync(o => o.IssueId == issueId);
        }

        public async Task<ResolutionOutcome> SaveAsync(ResolutionOutcome outcome)
        {
            if (outcome.Id == default)
            {
                _context.ResolutionOutcomes.Add(outcome);
            }
            else
            {
                _context.ResolutionOutcomes.Update(outcome);
            }

            await _context.SaveChangesAsync();
            return outcome;
        }
    }
}
