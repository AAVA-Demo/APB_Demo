using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationStepRepository : IRemediationStepRepository
    {
        private readonly AppDbContext _context;

        public RemediationStepRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<RemediationStep>> GetByInsightAsync(string caseId, string insightId)
        {
            return _context.RemediationSteps
                .Where(x => x.CaseId == caseId && x.InsightId == insightId)
                .OrderBy(x => x.StepOrder)
                .ToListAsync();
        }
    }
}
