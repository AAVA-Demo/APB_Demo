using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class GuidedActionLogRepository : IGuidedActionLogRepository
    {
        private readonly AppDbContext _dbContext;

        public GuidedActionLogRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddAsync(GuidedActionExecutionLog log)
        {
            _dbContext.GuidedActionExecutionLogs.Add(log);
            await _dbContext.SaveChangesAsync();
        }

        public Task<List<GuidedActionExecutionLog>> GetByInteractionId(string interactionId)
        {
            return _dbContext.GuidedActionExecutionLogs
                .Where(x => x.InteractionId == interactionId)
                .ToListAsync();
        }
    }
}
