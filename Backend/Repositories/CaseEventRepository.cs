using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CaseEventRepository : ICaseEventRepository
    {
        private readonly AppDbContext _dbContext;

        public CaseEventRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CaseEvent>> GetRecentEventsAsync(string caseId)
        {
            return await _dbContext.CaseEvents
                .Where(e => e.CaseId == caseId)
                .OrderByDescending(e => e.OccurredAtUtc)
                .Take(20)
                .ToListAsync();
        }
    }
}
