using Backend.Data;
using Backend.Repositories;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Backend
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("AppDb"));

            services.AddScoped<IDiagnosticInsightsRepository, DiagnosticInsightsRepository>();
            services.AddScoped<IRemediationRepository, RemediationRepository>();
            services.AddScoped<IRecommendationsRepository, RecommendationsRepository>();
            services.AddScoped<IMemberIssueSummaryRepository, MemberIssueSummaryRepository>();
            services.AddScoped<IInsightsRepository, InsightsRepository>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<IRemediationService, RemediationService>();
            services.AddScoped<IInsightAnalysisService, InsightAnalysisService>();
            services.AddScoped<IRecommendationsService, RecommendationsService>();
            services.AddScoped<IMemberIssueSummaryService, MemberIssueSummaryService>();
            services.AddScoped<IInsightsService, InsightsService>();

            return services;
        }
    }
}
