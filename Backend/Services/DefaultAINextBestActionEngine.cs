using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class DefaultAINextBestActionEngine : IAINextBestActionEngine
    {
        public Task<NextBestActionInternal?> GetNextBestAction(IssueContext context)
        {
            var action = new NextBestActionInternal
            {
                PromptText = "Next best action for issue " + context.MemberIssueId,
                StepCode = "STEP-001"
            };
            return Task.FromResult<NextBestActionInternal?>(action);
        }
    }
}
