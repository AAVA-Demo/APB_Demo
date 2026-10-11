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

            services.AddScoped<ICaseRepository, CaseRepository>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<ITelemetryStreamService, TelemetryStreamService>();
            services.AddScoped<ICaseContextService, CaseContextService>();

            services.AddScoped<IIssuePatternService, IssuePatternService>();
            services.AddScoped<IRemediationStepService, RemediationStepService>();
            services.AddScoped<IRemediationStepRepository, RemediationStepRepository>();

            services.AddScoped<IContextAwareRecommendationService, ContextAwareRecommendationService>();
            services.AddScoped<IRecommendationRepository, RecommendationRepository>();

            services.AddScoped<IResolutionSuggestionService, ResolutionSuggestionService>();
            services.AddScoped<IResolutionRepository, ResolutionRepository>();
            services.AddScoped<IResolutionRankingStrategy, ResolutionRankingStrategy>();

            services.AddScoped<IInsightConfidenceService, InsightConfidenceService>();
            services.AddScoped<IInsightRepository, InsightRepository>();
            services.AddScoped<IInsightDtoFactory, InsightDtoFactory>();

            services.AddScoped<IDiagnosticPanelService, DiagnosticPanelService>();
            services.AddScoped<IWorkspaceIntegrationService, WorkspaceIntegrationService>();

            return services;
        }
    }
}
