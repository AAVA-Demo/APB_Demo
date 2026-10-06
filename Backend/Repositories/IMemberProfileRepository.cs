using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IMemberProfileRepository
    {
        Task<MemberProfile?> GetByIdAsync(string id);
    }
}
