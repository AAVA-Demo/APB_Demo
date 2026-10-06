using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IMemberContextService
    {
        Task<MemberContext?> GetMemberContext(string memberIssueId);
    }
}
