using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticInsightSnapshotRepository
    {
        Task<List<DiagnosticInsightSnapshot>> GetByMemberIssueIdAsync(string memberIssueId);
        Task AddAsync(DiagnosticInsightSnapshot snapshot);
    }
}
