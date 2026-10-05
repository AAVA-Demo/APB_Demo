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

            services.AddScoped<IRealTimeInsightService, RealTimeInsightService>();
            services.AddScoped<IRealTimeInsightSource, RealTimeInsightSource>();

            services.AddScoped<IRemediationStepService, RemediationStepService>();
            services.AddScoped<IRemediationEngineClient, RemediationEngineClient>();

            services.AddScoped<IIssueContextSummaryService, IssueContextSummaryService>();
            services.AddScoped<IIssueContextMapper, IssueContextMapper>();

            services.AddScoped<IInsightIndicatorEnrichmentService, InsightIndicatorEnrichmentService>();
            services.AddScoped<IAIInsightEngine, AIInsightEngine>();
            services.AddScoped<IInsightIndicatorMapper, InsightIndicatorMapper>();

            services.AddScoped<IRecommendationFeedbackService, RecommendationFeedbackService>();
            services.AddScoped<IRecommendationFeedbackRepository, RecommendationFeedbackRepository>();

            services.AddScoped<IDiagnosticInsightService, DiagnosticInsightService>();
            services.AddScoped<ICaseContextResolverService, CaseContextResolverService>();
            services.AddScoped<ICaseContextMapper, CaseContextMapper>();

            return services;
        }
    }
}
