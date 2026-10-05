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

            services.AddScoped<IDiagnosticInsightsRepository, DiagnosticInsightsRepository>();
            services.AddScoped<IRemediationStepsRepository, RemediationStepsRepository>();
            services.AddScoped<ICaseSummaryRepository, CaseSummaryRepository>();
            services.AddScoped<IRecommendedActionsRepository, RecommendedActionsRepository>();
            services.AddScoped<IRecommendationsRepository, RecommendationsRepository>();
            services.AddScoped<IGuidedResolutionRepository, GuidedResolutionRepository>();

            services.AddScoped<IDiagnosticInsightsService, DiagnosticInsightsService>();
            services.AddScoped<IRemediationStepsService, RemediationStepsService>();
            services.AddScoped<ICaseSummaryService, CaseSummaryService>();
            services.AddScoped<IRecommendedActionsService, RecommendedActionsService>();
            services.AddScoped<IRecommendationsService, RecommendationsService>();
            services.AddScoped<IGuidedResolutionService, GuidedResolutionService>();

            return services;
        }
    }
}
