using Backend.Models;

namespace Backend.Repositories
{
    public interface IMemberInteractionRepository
    {
        Task<List<MemberInteraction>> FindByMemberIdAsync(string memberId);
    }
}
