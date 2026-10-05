using Backend.Models;

namespace Backend.Repositories
{
    public interface IMemberIssueRepository
    {
        Task<List<MemberIssue>> FindActiveIssuesByMemberIdAsync(string memberId);
        Task<List<MemberRecommendation>> FindRecommendationsByMemberIdAsync(string memberId);
    }
}
