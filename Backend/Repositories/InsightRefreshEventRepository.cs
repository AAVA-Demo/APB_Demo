using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class InsightRefreshEventRepository : IInsightRefreshEventRepository
    {
        private readonly AppDbContext _context;

        public InsightRefreshEventRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<InsightRefreshEvent>> GetByInteractionIdAsync(string interactionId)
        {
            return _context.InsightRefreshEvents
                .Where(e => e.InteractionId == interactionId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task SaveAsync(InsightRefreshEvent refreshEvent)
        {
            _context.InsightRefreshEvents.Add(refreshEvent);
            await _context.SaveChangesAsync();
        }
    }
}
