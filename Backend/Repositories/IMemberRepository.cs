using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IMemberRepository
    {
        Task<Member?> GetByIdAsync(string memberId);
    }
}
