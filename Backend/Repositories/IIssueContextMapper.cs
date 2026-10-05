using Backend.Dtos;

namespace Backend.Repositories
{
    public interface IIssueContextMapper
    {
        IssueContextSummaryResponseDto? ToSummaryResponse(string caseId);
    }
}
