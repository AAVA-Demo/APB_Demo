using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<CaseData> CaseData { get; set; } = null!;
        public DbSet<IssueData> CaseIssues { get; set; } = null!;
        public DbSet<CaseContext> CaseContexts { get; set; } = null!;
        public DbSet<CaseEvent> CaseEvents { get; set; } = null!;
        public DbSet<RemediationStepStatus> RemediationStepStatuses { get; set; } = null!;
    }
}
