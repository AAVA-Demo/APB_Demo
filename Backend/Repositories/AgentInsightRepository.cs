using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AgentInsightRepository : IAgentInsightRepository
    {
        private readonly AppDbContext _context;

        public AgentInsightRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<AgentInsight>> GetInsightsByInteractionIdAsync(string interactionId)
        {
            return _context.AgentInsights
                .Where(a => a.InteractionId == interactionId)
                .ToListAsync();
        }

        public Task<List<AgentRemediationStep>> GetStepsByInteractionIdAsync(string interactionId)
        {
            return _context.AgentRemediationSteps
                .Where(a => a.InteractionId == interactionId)
                .OrderBy(a => a.StepNumber)
                .ToListAsync();
        }
    }
}
