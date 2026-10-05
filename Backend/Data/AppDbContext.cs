using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<DiagnosticInsight> DiagnosticInsights { get; set; } = null!;
        public DbSet<RemediationStep> RemediationSteps { get; set; } = null!;
        public DbSet<Recommendation> Recommendations { get; set; } = null!;
        public DbSet<MemberContextSnapshot> MemberContextSnapshots { get; set; } = null!;
        public DbSet<Issue> Issues { get; set; } = null!;
        public DbSet<Workflow> Workflows { get; set; } = null!;
        public DbSet<WorkflowStep> WorkflowSteps { get; set; } = null!;
        public DbSet<WorkflowStepCompletion> WorkflowStepCompletions { get; set; } = null!;
        public DbSet<ResolutionOutcome> ResolutionOutcomes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Workflow>()
                .HasMany(w => w.Steps)
                .WithOne()
                .HasForeignKey(s => s.WorkflowId);
        }
    }
}
