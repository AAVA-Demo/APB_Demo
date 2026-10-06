using Backend.Data;
using Backend.Repositories;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Backend
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("AppDb"));

            services.AddScoped<IMemberIssueRepository, MemberIssueRepository>();
            services.AddScoped<IDIagnosticInsightSnapshotRepository, DiagnosticInsightSnapshotRepository>();
            services.AddScoped<IRemediationTemplateRepository, RemediationTemplateRepository>();
            services.AddScoped<IIdentifiedIssueRepository, IdentifiedIssueRepository>();
            services.AddScoped<IMemberProfileRepository, MemberProfileRepository>();
            services.AddScoped<IInteractionHistoryRepository, InteractionHistoryRepository>();
            services.AddScoped<IAiContextRecommendationRepository, AiContextRecommendationRepository>();
            services.AddScoped<IAiAssistedResolutionRepository, AiAssistedResolutionRepository>();
            services.AddScoped<IAiRecommendationResultRepository, AiRecommendationResultRepository>();
            services.AddScoped<IRecommendationTemplateRepository, RecommendationTemplateRepository>();
            services.AddScoped<IDiagnosticPanelConfigRepository, DiagnosticPanelConfigRepository>();

            services.AddScoped<IIssueContextService, IssueContextService>();
            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<IIssueIdentificationService, IssueIdentificationService>();
            services.AddScoped<IRemediationGuidanceService, RemediationGuidanceService>();
            services.AddScoped<IMemberContextService, MemberContextService>();
            services.AddScoped<IDataAnonymizationService, DataAnonymizationService>();
            services.AddScoped<IContextAwareRecommendationService, ContextAwareRecommendationService>();
            services.AddScoped<IMetricsFilterService, MetricsFilterService>();
            services.AddScoped<IResolutionMetricsService, ResolutionMetricsService>();
            services.AddScoped<IRecommendationContextService, RecommendationContextService>();
            services.AddScoped<INextBestActionService, NextBestActionService>();
            services.AddScoped<IDiagnosticPanelService, DiagnosticPanelService>();
            services.AddScoped<IWorkspaceContextService, WorkspaceContextService>();
            services.AddSingleton<IAuthenticationContextProvider, AuthenticationContextProvider>();

            services.AddSingleton<IAIInternalDiagnosticEngine, DefaultAIInternalDiagnosticEngine>();
            services.AddSingleton<IAIRecommendationEngine, DefaultAIRecommendationEngine>();
            services.AddSingleton<IAINextBestActionEngine, DefaultAINextBestActionEngine>();

            return services;
        }
    }
}
