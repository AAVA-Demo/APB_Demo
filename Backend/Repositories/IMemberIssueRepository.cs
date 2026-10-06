using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IMemberIssueRepository
    {
        Task<MemberIssue?> GetByIdAsync(string id);
        Task<List<MemberIssue>> GetAllAsync();
    }
}
