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

            services.AddScoped<IAiDiagnosticService, AiDiagnosticService>();
            services.AddScoped<IRecommendationService, RecommendationService>();
            services.AddScoped<IAiInsightService, AiInsightService>();
            services.AddScoped<IAgentDesktopLayoutService, AgentDesktopLayoutService>();
            services.AddScoped<IAuditLogService, AuditLogService>();

            services.AddScoped<IDiagnosticInsightCacheRepository, DiagnosticInsightCacheRepository>();
            services.AddScoped<IRecommendationCacheRepository, RecommendationCacheRepository>();
            services.AddScoped<IAiInsightCacheRepository, AiInsightCacheRepository>();
            services.AddScoped<IAgentDesktopLayoutRepository, AgentDesktopLayoutRepository>();
            services.AddScoped<IGuidedActionLogRepository, GuidedActionLogRepository>();
            services.AddScoped<IInteractionContextProvider, InteractionContextProvider>();
            services.AddScoped<IAiEngineClient, AiEngineClient>();
            services.AddScoped<IRecommendationFilter, RecommendationFilter>();
            services.AddScoped<IConfidenceScoreMapper, ConfidenceScoreMapper>();

            return services;
        }
    }
}
