using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface IDiagnosticOutcomeRepository
    {
        Task SaveAsync(DiagnosticOutcome outcome);
        Task<bool> ExistsAsync(string caseId, string insightId);
    }
}
