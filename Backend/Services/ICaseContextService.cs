using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface ICaseContextService
    {
        Task<CaseContext?> GetCaseContextAsync(string caseId);
        Task<CaseContext?> GetCaseContextAsync(string workspaceId, string caseId);
    }
}
