using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DiagnosticInsightsRepository : IDiagnosticInsightsRepository
    {
        private readonly AppDbContext _dbContext;

        public DiagnosticInsightsRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<DiagnosticInsight>> GetInsightsForMemberAsync(Guid memberId)
        {
            return await _dbContext.DiagnosticInsights
                .Where(i => i.MemberId == memberId)
                .OrderByDescending(i => i.GeneratedAt)
                .ToListAsync();
        }
    }
}
