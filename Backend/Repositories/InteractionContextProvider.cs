using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class InteractionContextProvider : IInteractionContextProvider
    {
        public Task<InteractionContext> GetInteractionContext(string interactionId)
        {
            var context = new InteractionContext
            {
                InteractionId = interactionId,
                Channel = "voice",
                Summary = "Sample interaction summary",
                AccountId = "account-1",
                CaseId = "case-1"
            };
            return Task.FromResult(context);
        }

        public Task EnsureInteractionExists(string interactionId)
        {
            if (string.IsNullOrWhiteSpace(interactionId))
            {
                throw new InteractionNotFoundException("Interaction not found.");
            }

            return Task.CompletedTask;
        }
    }
}
