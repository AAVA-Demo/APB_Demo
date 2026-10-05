using Backend.Models;

namespace Backend.Services
{
    public class RemediationStepEngine
    {
        public List<RemediationStep> OrderSteps(List<RemediationStep> steps)
        {
            foreach (var step in steps)
            {
                if (step.OrderIndex < 0)
                {
                    throw new ArgumentException("orderIndex must be non-negative");
                }
            }
            return steps.OrderBy(s => s.OrderIndex).ToList();
        }
    }
}
