using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IIssueRepository
    {
        Task<IEnumerable<Issue>> GetActiveIssuesAsync();
        Task<Issue?> GetIssueAsync(string issueId);
    }
}
