using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<GuidedResolutionWorkflowEntity> GuidedResolutionWorkflows { get; set; } = null!;
        public DbSet<GuidedResolutionStepEntity> GuidedResolutionSteps { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GuidedResolutionWorkflowEntity>()
                .HasMany(w => w.Steps)
                .WithOne(s => s.Workflow)
                .HasForeignKey(s => s.WorkflowId);
        }
    }
}
