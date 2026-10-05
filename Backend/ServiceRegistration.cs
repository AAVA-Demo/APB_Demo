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

            services.AddScoped<IDiagnosticRepository, DiagnosticRepository>();
            services.AddScoped<IMemberInteractionRepository, MemberInteractionRepository>();
            services.AddScoped<IRemediationStepRepository, RemediationStepRepository>();
            services.AddScoped<ISuggestionRepository, SuggestionRepository>();
            services.AddScoped<IMemberIssueRepository, MemberIssueRepository>();

            services.AddScoped<DiagnosticInsightsEngine>();
            services.AddScoped<IssueSummaryEngine>();
            services.AddScoped<RemediationStepEngine>();
            services.AddScoped<SuggestionConfidenceEngine>();
            services.AddScoped<MemberImpactAssessmentEngine>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<IIssueSummaryService, IssueSummaryService>();
            services.AddScoped<IRemediationStepService, RemediationStepService>();
            services.AddScoped<IRemediationStepTrackingService, RemediationStepTrackingService>();
            services.AddScoped<ISuggestionConfidenceService, SuggestionConfidenceService>();
            services.AddScoped<IMemberImpactPrioritizationService, MemberImpactPrioritizationService>();

            return services;
        }
    }
}
