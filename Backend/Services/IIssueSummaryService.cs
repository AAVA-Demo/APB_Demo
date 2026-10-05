using Backend.Dtos;

namespace Backend.Services
{
    public interface IIssueSummaryService
    {
        Task<IssueSummaryResponse> GetIssueSummaryAsync(string memberId, string issueId);
    }
}
