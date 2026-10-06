using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IInteractionHistoryRepository
    {
        Task<InteractionHistorySummary?> GetLatestByMemberIdAsync(string memberId);
    }
}
