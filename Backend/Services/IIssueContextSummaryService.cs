using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IIssueContextSummaryService
    {
        Task<IssueContextSummaryDto> GetIssueContextSummaryAsync(string caseId, string memberId);
        Task<IssueContextSummaryDto> BuildIssueContextSummaryAsync(string caseId, string memberId);
    }
}
