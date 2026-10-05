using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IIssueService
    {
        Task<IEnumerable<IssueDto>> GetActiveIssuesAsync();
        Task<IssueDto?> GetIssueAsync(string issueId);
    }
}
