using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<RealTimeInsight> RealTimeInsights { get; set; } = null!;
        public DbSet<MemberContext> MemberContexts { get; set; } = null!;
        public DbSet<MemberInteractionContext> MemberInteractionContexts { get; set; } = null!;
        public DbSet<MemberContextSummary> MemberContextSummaries { get; set; } = null!;
        public DbSet<Issue> Issues { get; set; } = null!;
        public DbSet<ContextSnapshot> ContextSnapshots { get; set; } = null!;
        public DbSet<RemediationInstruction> RemediationInstructions { get; set; } = null!;
        public DbSet<RemediationWorkflow> RemediationWorkflows { get; set; } = null!;
        public DbSet<RemediationStepInstance> RemediationStepInstances { get; set; } = null!;
        public DbSet<Insight> DiagnosticInsights { get; set; } = null!;
        public DbSet<RemediationStep> RemediationSteps { get; set; } = null!;
        public DbSet<InsightsRefreshInfo> InsightsRefreshInfos { get; set; } = null!;
    }
}
