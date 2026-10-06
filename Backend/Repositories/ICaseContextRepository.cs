using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseContextRepository
    {
        Task<CaseContext?> GetCaseContextAsync(string caseId);
    }
}
