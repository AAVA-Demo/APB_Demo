using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class RemediationEngine : IRemediationEngine
    {
        public Task<IReadOnlyList<RemediationStep>> GenerateRemediationStepsAsync(string caseId)
        {
            IReadOnlyList<RemediationStep> steps = new List<RemediationStep>
            {
                new RemediationStep
                {
                    StepNumber = 1,
                    Title = "Verify configuration",
                    Description = "Ensure configuration matches recommended settings."
                },
                new RemediationStep
                {
                    StepNumber = 2,
                    Title = "Restart service",
                    Description = "Restart the affected service and monitor."
                }
            };

            return Task.FromResult(steps);
        }
    }
}
