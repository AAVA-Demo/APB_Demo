using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Interaction> Interactions { get; set; } = null!;
        public DbSet<DiagnosticInsight> DiagnosticInsights { get; set; } = null!;
        public DbSet<Case> Cases { get; set; } = null!;
        public DbSet<RemediationStep> RemediationSteps { get; set; } = null!;
        public DbSet<IssueContextSummary> IssueContextSummaries { get; set; } = null!;
        public DbSet<Recommendation> Recommendations { get; set; } = null!;
        public DbSet<InsightRefreshEvent> InsightRefreshEvents { get; set; } = null!;
        public DbSet<AgentInsight> AgentInsights { get; set; } = null!;
        public DbSet<AgentRemediationStep> AgentRemediationSteps { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Interaction>().HasKey(i => i.InteractionId);
            modelBuilder.Entity<Case>().HasKey(c => c.CaseId);
            modelBuilder.Entity<DiagnosticInsight>().HasKey(d => d.InsightId);
            modelBuilder.Entity<RemediationStep>().HasKey(r => r.StepId);
            modelBuilder.Entity<IssueContextSummary>().HasKey(i => i.CaseId);
            modelBuilder.Entity<Recommendation>().HasKey(r => r.RecommendationId);
            modelBuilder.Entity<InsightRefreshEvent>().HasKey(e => e.EventId);
            modelBuilder.Entity<AgentInsight>().HasKey(a => a.InsightId);
            modelBuilder.Entity<AgentRemediationStep>().HasKey(a => a.StepId);

            modelBuilder.Entity<DiagnosticInsight>()
                .HasOne<Interaction>()
                .WithMany()
                .HasForeignKey(d => d.InteractionId);

            modelBuilder.Entity<RemediationStep>()
                .HasOne<Case>()
                .WithMany()
                .HasForeignKey(r => r.CaseId);

            modelBuilder.Entity<IssueContextSummary>()
                .HasOne<Case>()
                .WithMany()
                .HasForeignKey(i => i.CaseId);

            modelBuilder.Entity<Recommendation>()
                .HasOne<Interaction>()
                .WithMany()
                .HasForeignKey(r => r.InteractionId);

            modelBuilder.Entity<InsightRefreshEvent>()
                .HasOne<Interaction>()
                .WithMany()
                .HasForeignKey(e => e.InteractionId);

            modelBuilder.Entity<AgentInsight>()
                .HasOne<Interaction>()
                .WithMany()
                .HasForeignKey(a => a.InteractionId);

            modelBuilder.Entity<AgentRemediationStep>()
                .HasOne<Interaction>()
                .WithMany()
                .HasForeignKey(a => a.InteractionId);
        }
    }
}
