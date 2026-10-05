using Backend.Dtos;
using Backend.Services;

namespace Backend.Services
{
    public interface IIssueContextSummaryMapper
    {
        IssueContextSummaryDto ToSummaryDto(InteractionHistoryResponse history, string memberId, string caseId);
    }
}
