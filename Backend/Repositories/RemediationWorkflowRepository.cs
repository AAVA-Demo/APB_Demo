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

        public Task<RemediationWorkflow> GetWorkflowByCaseId(string caseId)
        {
            return _context.RemediationWorkflows.Include(w => w.Steps).FirstAsync(w => w.CaseId == caseId);
        }

        public async Task SaveWorkflow(RemediationWorkflow workflow)
        {
            _context.RemediationWorkflows.Add(workflow);
            await _context.SaveChangesAsync();
        }

        public Task<RemediationStepInstance> GetStepInstanceById(string stepInstanceId)
        {
            return _context.RemediationStepInstances.FirstAsync(s => s.StepInstanceId == stepInstanceId);
        }

        public async Task UpdateStepInstance(RemediationStepInstance stepInstance)
        {
            _context.RemediationStepInstances.Update(stepInstance);
            await _context.SaveChangesAsync();
        }
    }
}
