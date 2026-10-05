using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Member> Members => Set<Member>();
        public DbSet<DiagnosticRecord> DiagnosticRecords => Set<DiagnosticRecord>();
        public DbSet<MemberIssue> MemberIssues => Set<MemberIssue>();
        public DbSet<MemberInteraction> MemberInteractions => Set<MemberInteraction>();
        public DbSet<RemediationStep> RemediationSteps => Set<RemediationStep>();
        public DbSet<Suggestion> Suggestions => Set<Suggestion>();
        public DbSet<MemberRecommendation> MemberRecommendations => Set<MemberRecommendation>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Member>().HasKey(m => m.Id);
            modelBuilder.Entity<DiagnosticRecord>().HasKey(d => d.Id);
            modelBuilder.Entity<MemberIssue>().HasKey(i => i.Id);
            modelBuilder.Entity<MemberInteraction>().HasKey(i => i.Id);
            modelBuilder.Entity<RemediationStep>().HasKey(s => s.Id);
            modelBuilder.Entity<Suggestion>().HasKey(s => s.Id);
            modelBuilder.Entity<MemberRecommendation>().HasKey(r => r.Id);
        }
    }
}
