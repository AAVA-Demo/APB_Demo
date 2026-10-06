using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IIssueSeverityService
    {
        Task<CaseIssueListDto> GetCaseIssuesWithSeverityAsync(string caseId);
    }
}
