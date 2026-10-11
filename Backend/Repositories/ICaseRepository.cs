using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseRepository
    {
        Task<Case?> GetByIdAsync(string caseId);
    }
}
