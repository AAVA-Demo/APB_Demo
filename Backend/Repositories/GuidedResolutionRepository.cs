using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class GuidedResolutionRepository : IGuidedResolutionRepository
    {
        private readonly AppDbContext _dbContext;

        public GuidedResolutionRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GuidedResolutionWorkflowEntity> GetOrCreateWorkflowAsync(Guid issueId)
        {
            var existing = await _dbContext.GuidedResolutionWorkflows
                .Include(w => w.Steps)
                .FirstOrDefaultAsync(w => w.IssueId == issueId);

            if (existing != null)
            {
                return existing;
            }

            var workflow = new GuidedResolutionWorkflowEntity
            {
                Id = Guid.NewGuid(),
                IssueId = issueId,
                Name = "Default Guided Workflow",
                CreatedAt = DateTime.UtcNow,
                Status = "InProgress"
            };

            workflow.Steps.Add(new GuidedResolutionStepEntity
            {
                Id = Guid.NewGuid(),
                WorkflowId = workflow.Id,
                Order = 1,
                Title = "Verify member identity",
                Description = "Confirm member details before proceeding.",
                Status = "Pending"
            });

            workflow.Steps.Add(new GuidedResolutionStepEntity
            {
                Id = Guid.NewGuid(),
                WorkflowId = workflow.Id,
                Order = 2,
                Title = "Apply recommended fix",
                Description = "Follow recommended action steps.",
                Status = "Pending"
            });

            _dbContext.GuidedResolutionWorkflows.Add(workflow);
            await _dbContext.SaveChangesAsync();
            return workflow;
        }

        public async Task<GuidedResolutionWorkflowEntity?> GetWorkflowAsync(Guid issueId)
        {
            return await _dbContext.GuidedResolutionWorkflows
                .Include(w => w.Steps)
                .FirstOrDefaultAsync(w => w.IssueId == issueId);
        }

        public async Task<GuidedResolutionWorkflowEntity> UpdateStepStatusAsync(Guid issueId, Guid stepId, string newStatus)
        {
            var workflow = await _dbContext.GuidedResolutionWorkflows
                .Include(w => w.Steps)
                .FirstOrDefaultAsync(w => w.IssueId == issueId);

            if (workflow == null)
            {
                throw new InvalidOperationException("Workflow not found.");
            }

            var step = workflow.Steps.FirstOrDefault(s => s.Id == stepId);
            if (step == null)
            {
                throw new InvalidOperationException("Step not found.");
            }

            step.Status = newStatus;
            if (newStatus == "Completed")
            {
                step.CompletedAt = DateTime.UtcNow;
            }

            if (workflow.Steps.All(s => s.Status == "Completed"))
            {
                workflow.Status = "Completed";
            }
            else if (workflow.Steps.Any(s => s.Status == "Escalated"))
            {
                workflow.Status = "Escalated";
            }
            else
            {
                workflow.Status = "InProgress";
            }

            await _dbContext.SaveChangesAsync();
            return workflow;
        }
    }
}
