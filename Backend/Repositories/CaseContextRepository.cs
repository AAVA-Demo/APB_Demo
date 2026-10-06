using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CaseContextRepository : ICaseContextRepository
    {
        private readonly AppDbContext _dbContext;

        public CaseContextRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CaseContext?> GetCaseContextAsync(string caseId)
        {
            return await _dbContext.CaseContexts.FindAsync(caseId);
        }
    }
}
