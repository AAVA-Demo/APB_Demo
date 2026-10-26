using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<DiagnosticInsight> DiagnosticInsights => Set<DiagnosticInsight>();
        public DbSet<RemediationStep> RemediationSteps => Set<RemediationStep>();
        public DbSet<Insight> Insights => Set<Insight>();
        public DbSet<CaseInsightsSnapshot> CaseInsightsSnapshots => Set<CaseInsightsSnapshot>();
        public DbSet<RecommendationExplanation> RecommendationExplanations => Set<RecommendationExplanation>();
        public DbSet<RecommendationStep> RecommendationSteps => Set<RecommendationStep>();
        public DbSet<DiagnosticOutcome> DiagnosticOutcomes => Set<DiagnosticOutcome>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DiagnosticInsight>()
                .HasKey(x => new { x.CaseId, x.InsightId });

            modelBuilder.Entity<RemediationStep>()
                .HasKey(x => new { x.CaseId, x.InsightId, x.StepOrder });

            modelBuilder.Entity<Insight>()
                .HasKey(x => new { x.CaseId, x.InsightId });

            modelBuilder.Entity<CaseInsightsSnapshot>()
                .HasKey(x => x.CaseId);

            modelBuilder.Entity<Insight>()
                .HasOne<CaseInsightsSnapshot>()
                .WithMany()
                .HasForeignKey(x => x.CaseId);

            modelBuilder.Entity<RecommendationExplanation>()
                .HasKey(x => x.RecommendationId);

            modelBuilder.Entity<RecommendationStep>()
                .HasKey(x => new { x.RecommendationId, x.StepOrder });

            modelBuilder.Entity<DiagnosticOutcome>()
                .HasKey(x => new { x.CaseId, x.InsightId });
        }
    }
}
