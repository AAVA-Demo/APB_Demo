using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IHealthRepository
    {
        Task<HealthCheck> GetLastAsync();
        Task AddAsync(HealthCheck healthCheck);
    }
}
