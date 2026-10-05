using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public class HealthService : IHealthService
    {
        public Task<HealthStatusDto> GetHealthStatusAsync()
        {
            var dto = new HealthStatusDto
            {
                Status = "OK",
                Message = "Service is running"
            };
            return Task.FromResult(dto);
        }
    }
}
