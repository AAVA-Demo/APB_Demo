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

            services.AddScoped<IRealTimeDiagnosticInsightsService, RealTimeDiagnosticInsightsService>();
            services.AddScoped<IMemberContextService, MemberContextService>();
            services.AddSingleton<IRealTimeInsightsEngineClient, RealTimeInsightsEngineClient>();
            services.AddScoped<IRealTimeInsightsRepository, RealTimeInsightsRepository>();

            services.AddScoped<IRemediationInstructionsService, RemediationInstructionsService>();
            services.AddScoped<IRemediationInstructionsRepository, RemediationInstructionsRepository>();
            services.AddSingleton<IRemediationEngineClient, RemediationEngineClient>();

            services.AddScoped<IContextAwareIssueService, ContextAwareIssueService>();
            services.AddScoped<IIssueRepository, IssueRepository>();
            services.AddSingleton<IIssueDetectionEngineClient, IssueDetectionEngineClient>();

            services.AddScoped<IRemediationWorkflowService, RemediationWorkflowService>();
            services.AddScoped<IRemediationWorkflowRepository, RemediationWorkflowRepository>();

            services.AddScoped<IInsightConfidenceService, InsightConfidenceService>();
            services.AddScoped<IInsightsRepository, InsightsRepository>();
            services.AddSingleton<IConfidenceCalculationPolicyProvider, ConfidenceCalculationPolicyProvider>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddSingleton<IMemberEventStreamClient, MemberEventStreamClient>();
            services.AddSingleton<IInsightsRefreshSchedulerService, InsightsRefreshSchedulerService>();

            return services;
        }
    }
}
