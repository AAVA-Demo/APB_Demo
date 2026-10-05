using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<SupportCase> SupportCases { get; set; } = null!;
        public DbSet<DiagnosticInsight> DiagnosticInsights { get; set; } = null!;
        public DbSet<DiagnosticInsightEvent> DiagnosticInsightEvents { get; set; } = null!;
        public DbSet<Member> Members { get; set; } = null!;
        public DbSet<MemberHistoryEvent> MemberHistoryEvents { get; set; } = null!;
        public DbSet<CaseResolutionMetrics> CaseResolutionMetrics { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CaseResolutionMetrics>()
                .HasIndex(m => m.CaseId)
                .IsUnique();
        }
    }
}
