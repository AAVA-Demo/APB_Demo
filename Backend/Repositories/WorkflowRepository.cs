using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class WorkflowRepository : IWorkflowRepository
    {
        private readonly AppDbContext _context;

        public WorkflowRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Workflow?> GetWorkflowByIssueAsync(string issueId)
        {
            return await _context.Workflows
                .Include(w => w.Steps)
                .FirstOrDefaultAsync(w => w.IssueId == issueId);
        }

        public async Task SaveStepCompletionAsync(WorkflowStepCompletion completion)
        {
            var existing = await _context.WorkflowStepCompletions
                .FirstOrDefaultAsync(c => c.IssueId == completion.IssueId && c.StepId == completion.StepId && c.AgentId == completion.AgentId);

            if (existing == null)
            {
                _context.WorkflowStepCompletions.Add(completion);
            }
            else
            {
                existing.IsCompleted = completion.IsCompleted;
                existing.CompletedAt = completion.CompletedAt;
            }

            await _context.SaveChangesAsync();
        }
    }
}
