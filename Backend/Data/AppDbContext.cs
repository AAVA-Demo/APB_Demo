using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Case> Cases => Set<Case>();
        public DbSet<CaseInsightRealtime> CaseInsightRealtimes => Set<CaseInsightRealtime>();
        public DbSet<RemediationStep> RemediationSteps => Set<RemediationStep>();
        public DbSet<IssuePattern> IssuePatterns => Set<IssuePattern>();
        public DbSet<CaseResolutionSuggestion> CaseResolutionSuggestions => Set<CaseResolutionSuggestion>();
        public DbSet<CaseInsight> CaseInsights => Set<CaseInsight>();
        public DbSet<Workspace> Workspaces => Set<Workspace>();
        public DbSet<CaseContextEntity> CaseContexts => Set<CaseContextEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Case>().HasKey(c => c.CaseId);
            modelBuilder.Entity<Workspace>().HasKey(w => w.WorkspaceId);
            modelBuilder.Entity<CaseInsightRealtime>().HasKey(i => i.Id);
            modelBuilder.Entity<RemediationStep>().HasKey(r => new { r.IssuePatternId, r.StepNumber });
            modelBuilder.Entity<IssuePattern>().HasKey(i => i.IssuePatternId);
            modelBuilder.Entity<CaseResolutionSuggestion>().HasKey(r => r.Id);
            modelBuilder.Entity<CaseInsight>().HasKey(i => i.Id);
            modelBuilder.Entity<CaseContextEntity>().HasKey(c => c.CaseId);

            modelBuilder.Entity<Case>()
                .HasOne<Workspace>()
                .WithMany()
                .HasForeignKey(c => c.WorkspaceId);
        }
    }
}
