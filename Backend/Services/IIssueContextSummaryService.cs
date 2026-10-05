using Backend.Dtos;

namespace Backend.Services
{
    public interface IIssueContextSummaryService
    {
        IssueContextSummaryResponseDto? GetSummary(string caseId);
    }
}
