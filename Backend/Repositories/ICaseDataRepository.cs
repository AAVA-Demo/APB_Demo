using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseDataRepository
    {
        Task<CaseData?> GetCaseByIdAsync(string caseId);
    }
}
