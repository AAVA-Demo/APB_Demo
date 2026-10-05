using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<RealTimeInsightCache> RealTimeInsightCaches => Set<RealTimeInsightCache>();
        public DbSet<RemediationStepTemplate> RemediationStepTemplates => Set<RemediationStepTemplate>();
        public DbSet<IssueContextSummaryCache> IssueContextSummaryCaches => Set<IssueContextSummaryCache>();
        public DbSet<InsightIndicatorCache> InsightIndicatorCaches => Set<InsightIndicatorCache>();
        public DbSet<RecommendationFeedbackEntity> RecommendationFeedback => Set<RecommendationFeedbackEntity>();
        public DbSet<CaseContext> CaseContexts => Set<CaseContext>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RealTimeInsightCache>().HasKey(x => x.CaseId);
            modelBuilder.Entity<IssueContextSummaryCache>().HasKey(x => x.CaseId);
            modelBuilder.Entity<InsightIndicatorCache>().HasKey(x => x.InsightId);
            modelBuilder.Entity<CaseContext>().HasKey(x => x.CaseId);
        }
    }
}
