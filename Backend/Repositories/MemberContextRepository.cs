using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MemberContextRepository : IMemberContextRepository
    {
        private readonly AppDbContext _context;

        public MemberContextRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MemberIssueEntity?> GetIssueAsync(Guid memberId, Guid caseId)
        {
            return await _context.MemberIssues
                .FirstOrDefaultAsync(i => i.MemberId == memberId && i.Id == caseId);
        }

        public async Task<IList<MemberInteractionEntity>> GetRecentInteractionsAsync(Guid memberId, Guid caseId)
        {
            var cutoff = DateTime.UtcNow.AddDays(-90);
            return await _context.MemberInteractions
                .Where(i => i.MemberId == memberId && i.CaseId == caseId && i.OccurredAt >= cutoff)
                .OrderByDescending(i => i.OccurredAt)
                .Take(20)
                .ToListAsync();
        }

        public async Task<IList<MemberHistoryEntity>> GetRelevantHistoryAsync(Guid memberId)
        {
            return await _context.MemberHistory
                .Where(h => h.MemberId == memberId)
                .OrderByDescending(h => h.OccurredAt)
                .Take(20)
                .ToListAsync();
        }
    }
}
