using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CaseDataRepository : ICaseDataRepository
    {
        private readonly AppDbContext _dbContext;

        public CaseDataRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CaseData?> GetCaseByIdAsync(string caseId)
        {
            return await _dbContext.CaseData.FindAsync(caseId);
        }
    }
}
