using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IInteractionContextProvider
    {
        Task<InteractionContext> GetInteractionContext(string interactionId);
        Task EnsureInteractionExists(string interactionId);
    }
}
