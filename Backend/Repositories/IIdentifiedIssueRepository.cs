using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IIdentifiedIssueRepository
    {
        Task<IdentifiedIssue?> GetByMemberIssueIdAsync(string memberIssueId);
    }
}
