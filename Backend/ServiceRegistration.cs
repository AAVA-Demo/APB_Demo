using Backend.Repositories;
using Backend.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Backend
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            services.AddScoped<IDiagnosticInsightRepository, DiagnosticInsightRepository>();
            services.AddScoped<IRemediationGuidanceRepository, RemediationGuidanceRepository>();
            services.AddScoped<IIssueContextSummaryRepository, IssueContextSummaryRepository>();
            services.AddScoped<IRecommendationRankingRepository, RecommendationRankingRepository>();
            services.AddScoped<IInsightRefreshEventRepository, InsightRefreshEventRepository>();
            services.AddScoped<IAgentInsightRepository, AgentInsightRepository>();

            services.AddScoped<IAiDiagnosticClient, AiDiagnosticClient>();
            services.AddScoped<IDiagnosticInsightMapper, DiagnosticInsightMapper>();
            services.AddScoped<IDiagnosticInsightService, DiagnosticInsightService>();

            services.AddScoped<IAiRemediationClient, AiRemediationClient>();
            services.AddScoped<IRemediationGuidanceMapper, RemediationGuidanceMapper>();
            services.AddScoped<IRemediationGuidanceService, RemediationGuidanceService>();

            services.AddScoped<IInteractionHistoryClient, InteractionHistoryClient>();
            services.AddScoped<IIssueContextSummaryMapper, IssueContextSummaryMapper>();
            services.AddScoped<IIssueContextSummaryService, IssueContextSummaryService>();

            services.AddScoped<IAiRecommendationClient, AiRecommendationClient>();
            services.AddScoped<IRecommendationRankingMapper, RecommendationRankingMapper>();
            services.AddScoped<IRecommendationRankingService, RecommendationRankingService>();

            services.AddScoped<IAiInsightClient, AiInsightClient>();
            services.AddSingleton<IInsightUpdateNotifier, InsightUpdateNotifier>();
            services.AddScoped<IInsightRefreshService, InsightRefreshService>();

            services.AddScoped<IAiAgentInsightClient, AiAgentInsightClient>();
            services.AddScoped<IAgentInsightMapper, AgentInsightMapper>();
            services.AddScoped<IAgentInsightLanguageService, AgentInsightLanguageService>();

            return services;
        }
    }
}
