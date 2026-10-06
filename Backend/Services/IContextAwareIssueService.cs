using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IContextAwareIssueService
    {
        Task<ContextAwareIssueAnalysisResponseDto> AnalyzeCase(string caseId);
        Task<ContextAwareIssuesResponseDto> GetIssues(string caseId);
    }
}
