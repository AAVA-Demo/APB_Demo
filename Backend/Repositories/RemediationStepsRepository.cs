using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Repositories
{
    public class RemediationStepsRepository : IRemediationStepsRepository
    {
        public Task<List<RemediationStepDto>> GetRemediationStepsAsync(Guid issueId)
        {
            var steps = new List<RemediationStepDto>
            {
                new RemediationStepDto
                {
                    Id = Guid.NewGuid(),
                    IssueId = issueId,
                    StepOrder = 1,
                    Title = "Restart service",
                    Description = "Restart the affected service to clear transient issues.",
                    Category = "Standard"
                },
                new RemediationStepDto
                {
                    Id = Guid.NewGuid(),
                    IssueId = issueId,
                    StepOrder = 2,
                    Title = "Collect logs",
                    Description = "Gather logs for further analysis.",
                    Category = "Investigation"
                }
            };
            return Task.FromResult(steps.OrderBy(s => s.StepOrder).ToList());
        }
    }
}
