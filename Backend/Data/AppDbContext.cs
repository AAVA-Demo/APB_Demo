using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<InsightEntity> Insights { get; set; } = null!;
        public DbSet<RemediationStepEntity> RemediationSteps { get; set; } = null!;
        public DbSet<MemberIssueEntity> MemberIssues { get; set; } = null!;
        public DbSet<MemberInteractionEntity> MemberInteractions { get; set; } = null!;
        public DbSet<MemberHistoryEntity> MemberHistory { get; set; } = null!;
        public DbSet<WorkflowEntity> Workflows { get; set; } = null!;
        public DbSet<WorkflowStepEntity> WorkflowSteps { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<InsightEntity>()
                .HasIndex(i => i.IssueId);

            modelBuilder.Entity<RemediationStepEntity>()
                .HasIndex(r => r.InsightId);

            modelBuilder.Entity<MemberIssueEntity>()
                .HasIndex(m => m.MemberId);

            modelBuilder.Entity<MemberInteractionEntity>()
                .HasIndex(i => new { i.MemberId, i.CaseId });

            modelBuilder.Entity<MemberHistoryEntity>()
                .HasIndex(h => h.MemberId);

            modelBuilder.Entity<WorkflowStepEntity>()
                .HasOne<WorkflowEntity>()
                .WithMany()
                .HasForeignKey(s => s.WorkflowId);
        }
    }
}
