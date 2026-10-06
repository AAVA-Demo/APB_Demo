using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CaseIssueRepository : ICaseIssueRepository
    {
        private readonly AppDbContext _dbContext;

        public CaseIssueRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IssueData?> GetIssueByIdAsync(string caseId, string issueId)
        {
            return await _dbContext.CaseIssues
                .FirstOrDefaultAsync(i => i.IssueId == issueId && i.CaseId == caseId);
        }

        public async Task<List<IssueData>> GetIssuesForCaseAsync(string caseId)
        {
            return await _dbContext.CaseIssues
                .Where(i => i.CaseId == caseId)
                .ToListAsync();
        }
    }
}
