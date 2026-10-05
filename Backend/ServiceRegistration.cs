using Backend.Data;
using Backend.Repositories;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Backend
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("AppDb"));

            services.AddScoped<IDiagnosticInsightsRepository, DiagnosticInsightsRepository>();
            services.AddScoped<IRemediationRepository, RemediationRepository>();
            services.AddScoped<IMemberContextRepository, MemberContextRepository>();
            services.AddScoped<IRemediationWorkflowRepository, RemediationWorkflowRepository>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<IRemediationService, RemediationService>();
            services.AddScoped<IMemberContextService, MemberContextService>();
            services.AddScoped<IRemediationWorkflowService, RemediationWorkflowService>();

            services.AddSingleton<IRealTimeUpdatePublisher, RealTimeUpdatePublisher>();

            return services;
        }
    }
}
