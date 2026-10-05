using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class HealthRepository : IHealthRepository
    {
        private readonly AppDbContext _context;

        public HealthRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<HealthCheck> GetLastAsync()
        {
            return await _context.HealthChecks
                .OrderByDescending(h => h.Id)
                .FirstOrDefaultAsync();
        }

        public async Task AddAsync(HealthCheck healthCheck)
        {
            await _context.HealthChecks.AddAsync(healthCheck);
            await _context.SaveChangesAsync();
        }
    }
}
