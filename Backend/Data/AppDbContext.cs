using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<DiagnosticInsightCache> DiagnosticInsightCaches { get; set; } = null!;
        public DbSet<RecommendationCache> RecommendationCaches { get; set; } = null!;
        public DbSet<AiInsightCache> AiInsightCaches { get; set; } = null!;
        public DbSet<GuidedActionExecutionLog> GuidedActionExecutionLogs { get; set; } = null!;
        public DbSet<AgentDesktopLayoutConfigurationEntity> AgentDesktopLayoutConfigurations { get; set; } = null!;
        public DbSet<DesktopRegionConfigurationEntity> DesktopRegionConfigurations { get; set; } = null!;
        public DbSet<AiDiagnosticPanelConfigurationEntity> AiDiagnosticPanelConfigurations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DiagnosticInsightCache>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<RecommendationCache>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<AiInsightCache>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<GuidedActionExecutionLog>()
                .HasKey(x => x.LogId);
        }
    }
}
