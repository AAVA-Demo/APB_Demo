using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class RemediationStepRepository : IRemediationStepRepository
    {
        private readonly AppDbContext _dbContext;

        public RemediationStepRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<RemediationStep>> GetStepsAsync(string issuePatternId)
        {
            return await _dbContext.RemediationSteps
                .Where(r => r.IssuePatternId == issuePatternId)
                .OrderBy(r => r.StepNumber)
                .ToListAsync();
        }
    }
}
