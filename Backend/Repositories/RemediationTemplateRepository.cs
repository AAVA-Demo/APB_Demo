using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationTemplateRepository : IRemediationTemplateRepository
    {
        private readonly AppDbContext _context;

        public RemediationTemplateRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<RemediationTemplate>> GetByIssueCodeAsync(string issueCode)
        {
            return await _context.RemediationTemplates.Where(x => x.IssueCode == issueCode).OrderBy(x => x.StepNumber).ToListAsync();
        }
    }
}
