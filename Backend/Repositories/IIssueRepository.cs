using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IIssueRepository
    {
        Task SaveIssues(string caseId, string contextSnapshotId, List<Issue> issues);
        Task<List<Issue>> GetIssuesByCaseId(string caseId);
        Task<string> GetLatestContextSnapshotId(string caseId);
    }
}
