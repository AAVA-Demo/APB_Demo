using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CaseRepository : ICaseRepository
    {
        private readonly AppDbContext _dbContext;

        public CaseRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<Case?> GetByIdAsync(string caseId)
        {
            return _dbContext.Cases.FirstOrDefaultAsync(c => c.CaseId == caseId);
        }
    }
}
