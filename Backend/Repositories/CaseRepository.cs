using System.Threading.Tasks;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CaseRepository : ICaseRepository
    {
        private readonly AppDbContext _context;

        public CaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<bool> CaseExistsAsync(string caseId)
        {
            // Minimal deterministic implementation using Recommendations as proxy
            return _context.Recommendations.AnyAsync(r => r.CaseId == caseId);
        }
    }
}
