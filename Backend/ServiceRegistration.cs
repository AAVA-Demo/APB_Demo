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

            services.AddScoped<ISupportCaseRepository, SupportCaseRepository>();
            services.AddScoped<IMemberRepository, MemberRepository>();
            services.AddScoped<ICaseResolutionMetricsRepository, CaseResolutionMetricsRepository>();
            services.AddScoped<IMemberHistoryClient, MemberHistoryClient>();
            services.AddScoped<IAIInsightsGenerator, AIInsightsGenerator>();
            services.AddScoped<IRemediationEngine, RemediationEngine>();
            services.AddScoped<IRootCauseEngine, RootCauseEngine>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<IRemediationInstructionService, RemediationInstructionService>();
            services.AddScoped<IRootCauseRecommendationService, RootCauseRecommendationService>();
            services.AddScoped<IContextAwareInsightsService, ContextAwareInsightsService>();
            services.AddScoped<IDiagnosticInsightsUpdateService, DiagnosticInsightsUpdateService>();
            services.AddScoped<IDiagnosticInsightsEventPublisher, DiagnosticInsightsEventPublisher>();
            services.AddScoped<ICaseResolutionMetricsService, CaseResolutionMetricsService>();

            return services;
        }
    }
}
