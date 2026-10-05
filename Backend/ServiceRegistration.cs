using Backend.Repositories;
using Backend.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Backend
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddScoped<IHealthRepository, HealthRepository>();
            services.AddScoped<IHealthService, HealthService>();
            return services;
        }
    }
}
