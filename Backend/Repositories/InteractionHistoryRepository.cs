using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class InteractionHistoryRepository : IInteractionHistoryRepository
    {
        private readonly AppDbContext _context;

        public InteractionHistoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<InteractionHistorySummary?> GetLatestByMemberIdAsync(string memberId)
        {
            return await _context.InteractionHistorySummaries.Where(x => x.MemberId == memberId).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
        }
    }
}
