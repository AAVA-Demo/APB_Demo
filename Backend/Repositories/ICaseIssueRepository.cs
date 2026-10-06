using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseIssueRepository
    {
        Task<IssueData?> GetIssueByIdAsync(string caseId, string issueId);
        Task<List<IssueData>> GetIssuesForCaseAsync(string caseId);
    }
}
