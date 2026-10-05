using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IHealthService
    {
        Task<HealthStatusDto> GetHealthStatusAsync();
    }
}
