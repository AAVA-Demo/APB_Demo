using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IRemediationGuidanceService
    {
        Task<RemediationGuidanceDto> GetIssueRemediationStepsAsync(string caseId, string issueId);
    }
}
