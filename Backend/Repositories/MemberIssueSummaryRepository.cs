using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MemberIssueSummaryRepository : IMemberIssueSummaryRepository
    {
        private readonly AppDbContext _dbContext;

        public MemberIssueSummaryRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CaseAndInteractionsResult> GetCaseAndInteractionsAsync(Guid memberId)
        {
            var result = new CaseAndInteractionsResult();

            result.Case = await _dbContext.Cases
                .Where(c => c.MemberId == memberId)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();

            result.Interactions = await _dbContext.Interactions
                .Where(i => i.MemberId == memberId)
                .OrderBy(i => i.OccurredAt)
                .ToListAsync();

            return result;
        }
    }
}
