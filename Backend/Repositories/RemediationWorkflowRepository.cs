using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RemediationWorkflowRepository : IRemediationWorkflowRepository
    {
        private readonly AppDbContext _context;

        public RemediationWorkflowRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WorkflowEntity?> GetWorkflowByIssueAsync(Guid issueId)
        {
            return await _context.Workflows.FirstOrDefaultAsync(w => w.IssueId == issueId);
        }

        public async Task<IList<WorkflowStepEntity>> GetStepsByWorkflowAsync(Guid workflowId)
        {
            return await _context.WorkflowSteps
                .Where(s => s.WorkflowId == workflowId)
                .OrderBy(s => s.Order)
                .ToListAsync();
        }

        public async Task<WorkflowStepEntity?> GetStepByIdAsync(Guid stepId)
        {
            return await _context.WorkflowSteps.FirstOrDefaultAsync(s => s.Id == stepId);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
