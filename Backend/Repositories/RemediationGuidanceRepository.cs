using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationGuidanceRepository : IRemediationGuidanceRepository
    {
        private readonly AppDbContext _context;

        public RemediationGuidanceRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<RemediationStep>> GetByCaseIdAsync(string caseId)
        {
            return _context.RemediationSteps
                .Where(r => r.CaseId == caseId)
                .OrderBy(r => r.StepNumber)
                .ToListAsync();
        }
    }
}
