using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ICaseResolutionMetricsRepository
    {
        Task<CaseResolutionMetrics?> GetByCaseIdAsync(string caseId);
        Task AddAsync(CaseResolutionMetrics metrics);
    }
}
