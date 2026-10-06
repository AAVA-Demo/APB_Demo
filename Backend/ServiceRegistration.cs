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

            services.AddScoped<ICaseDataRepository, CaseDataRepository>();
            services.AddScoped<ICaseIssueRepository, CaseIssueRepository>();
            services.AddScoped<ICaseContextRepository, CaseContextRepository>();
            services.AddScoped<ICaseEventRepository, CaseEventRepository>();
            services.AddScoped<IAiEngineClient, AiEngineClient>();
            services.AddScoped<IRemediationStepRepository, RemediationStepRepository>();

            services.AddScoped<IAiDiagnosticService, AiDiagnosticService>();
            services.AddScoped<IRemediationGuidanceService, RemediationGuidanceService>();
            services.AddScoped<IContextAwareRecommendationService, ContextAwareRecommendationService>();
            services.AddScoped<IInsightRefreshService, InsightRefreshService>();
            services.AddScoped<IIssueSeverityService, IssueSeverityService>();
            services.AddScoped<IRemediationStepTrackingService, RemediationStepTrackingService>();

            return services;
        }
    }
}
