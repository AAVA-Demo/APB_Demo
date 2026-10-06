using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<MemberIssue> MemberIssues { get; set; } = null!;
        public DbSet<DiagnosticInsightSnapshot> DiagnosticInsightSnapshots { get; set; } = null!;
        public DbSet<RemediationTemplate> RemediationTemplates { get; set; } = null!;
        public DbSet<IdentifiedIssue> IdentifiedIssues { get; set; } = null!;
        public DbSet<MemberProfile> MemberProfiles { get; set; } = null!;
        public DbSet<InteractionHistorySummary> InteractionHistorySummaries { get; set; } = null!;
        public DbSet<AiContextRecommendation> AiContextRecommendations { get; set; } = null!;
        public DbSet<AiAssistedResolution> AiAssistedResolutions { get; set; } = null!;
        public DbSet<RecommendationTemplate> RecommendationTemplates { get; set; } = null!;
        public DbSet<AiRecommendationResult> AiRecommendationResults { get; set; } = null!;
        public DbSet<DiagnosticPanelConfig> DiagnosticPanelConfigs { get; set; } = null!;
        public DbSet<DiagnosticPanelSection> DiagnosticPanelSections { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DiagnosticPanelConfig>()
                .HasMany(c => c.Sections)
                .WithOne()
                .HasForeignKey(s => s.PanelConfigId);
        }
    }
}
