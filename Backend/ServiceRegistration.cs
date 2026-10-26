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
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IDiagnosticInsightRepository, DiagnosticInsightRepository>();
            services.AddScoped<IDiagnosticInsightService, DiagnosticInsightService>();

            services.AddScoped<IRemediationStepRepository, RemediationStepRepository>();
            services.AddScoped<IRemediationStepService, RemediationStepService>();

            services.AddScoped<IInsightRepository, InsightRepository>();
            services.AddScoped<IInsightPriorityService, InsightPriorityService>();
            services.AddScoped<IInsightRefreshService, InsightRefreshService>();

            services.AddScoped<IRecommendationExplanationRepository, RecommendationExplanationRepository>();
            services.AddScoped<IRecommendationExplanationService, RecommendationExplanationService>();

            services.AddScoped<IDiagnosticOutcomeRepository, DiagnosticOutcomeRepository>();
            services.AddScoped<IDiagnosticInsightOutcomeService, DiagnosticInsightOutcomeService>();

            services.AddSingleton<IInsightRefreshHub, InsightRefreshHub>();
            services.AddSingleton<IInsightEventListener, InsightEventListener>();

            services.AddSingleton<IInsightEngine, DefaultInsightEngine>();

            return services;
        }
    }
}
