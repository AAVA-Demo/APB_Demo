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

            services.AddScoped<ITelemetryRepository, TelemetryRepository>();
            services.AddScoped<ICaseRepository, CaseRepository>();
            services.AddScoped<IRemediationRepository, RemediationRepository>();
            services.AddScoped<IRecommendationsRepository, RecommendationsRepository>();
            services.AddScoped<IIssueRepository, IssueRepository>();
            services.AddScoped<IWorkflowRepository, WorkflowRepository>();
            services.AddScoped<IResolutionOutcomeRepository, ResolutionOutcomeRepository>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<IRemediationService, RemediationService>();
            services.AddScoped<IRecommendationsService, RecommendationsService>();
            services.AddScoped<IIssueService, IssueService>();
            services.AddScoped<IWorkflowService, WorkflowService>();
            services.AddScoped<IResolutionOutcomeService, ResolutionOutcomeService>();

            return services;
        }
    }
}
