using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IMemberContextService
    {
        Task<MemberInteractionContext> GetCurrentInteractionContext(string caseId);
        Task<MemberContext> GetMemberContext(string caseId);
        Task<MemberContext> GetCurrentMemberContext(string caseId);
        Task<MemberContextSummary> GetMemberContextSummary(string caseId);
    }
}
