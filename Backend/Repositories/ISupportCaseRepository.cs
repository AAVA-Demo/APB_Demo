using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ISupportCaseRepository
    {
        Task<SupportCase?> GetByIdAsync(string caseId);
        Task AddDiagnosticInsightAsync(DiagnosticInsight insight);
        Task AddDiagnosticInsightEventAsync(DiagnosticInsightEvent insightEvent);
    }
}
