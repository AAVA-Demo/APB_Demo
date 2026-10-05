using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface ICaseRepository
    {
        Task<bool> CaseExistsAsync(string caseId);
    }
}
