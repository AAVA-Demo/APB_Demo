using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ResolutionRepository : IResolutionRepository
    {
        private readonly AppDbContext _dbContext;

        public ResolutionRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ResolutionOption>> GetOptionsAsync(string caseId)
        {
            var @case = await _dbContext.Cases.FirstOrDefaultAsync(c => c.CaseId == caseId);
            if (@case == null)
            {
                throw new CaseNotFoundException();
            }

            return await _dbContext.CaseResolutionSuggestions
                .Where(r => r.CaseId == caseId)
                .Select(r => new ResolutionOption
                {
                    Id = r.Id,
                    Text = r.Text,
                    EstimatedTimeMinutes = r.EstimatedTimeMinutes,
                    SuccessProbability = r.SuccessProbability
                })
                .ToListAsync();
        }
    }
}
