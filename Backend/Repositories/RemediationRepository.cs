using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationRepository : IRemediationRepository
    {
        private readonly AppDbContext _dbContext;

        public RemediationRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<RemediationStep>> GetStepsForMemberAsync(Guid memberId)
        {
            return await _dbContext.RemediationSteps
                .Where(s => s.MemberId == memberId)
                .OrderBy(s => s.Order)
                .ToListAsync();
        }

        public async Task<List<RemediationStep>> GetOrCreateStepsAsync(Guid memberId, IReadOnlyList<string> rootCauses)
        {
            var existing = await GetStepsForMemberAsync(memberId);
            if (existing.Count > 0)
            {
                return existing;
            }

            var steps = new List<RemediationStep>();
            var order = 1;
            foreach (var cause in rootCauses)
            {
                steps.Add(new RemediationStep
                {
                    Id = Guid.NewGuid(),
                    MemberId = memberId,
                    Order = order++,
                    Title = $"Address {cause}",
                    Description = $"Review and resolve identified root cause: {cause}.",
                    RootCauseId = cause,
                    IsCompleted = false,
                    CompletedAt = null
                });
            }

            _dbContext.RemediationSteps.AddRange(steps);
            await _dbContext.SaveChangesAsync();

            return steps;
        }

        public async Task<RemediationStep?> GetStepAsync(Guid memberId, Guid stepId)
        {
            return await _dbContext.RemediationSteps
                .FirstOrDefaultAsync(s => s.MemberId == memberId && s.Id == stepId);
        }

        public async Task SaveAsync(RemediationStep step)
        {
            _dbContext.RemediationSteps.Update(step);
            await _dbContext.SaveChangesAsync();
        }
    }
}
