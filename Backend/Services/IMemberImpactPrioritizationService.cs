using Backend.Dtos;

namespace Backend.Services
{
    public interface IMemberImpactPrioritizationService
    {
        Task<MemberImpactIssuesResponse> GetPrioritizedIssuesAsync(string memberId);
        Task<MemberImpactRecommendationsResponse> GetPrioritizedRecommendationsAsync(string memberId);
    }
}
