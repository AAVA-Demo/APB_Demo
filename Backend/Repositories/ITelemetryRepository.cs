using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public interface ITelemetryRepository
    {
        Task<IEnumerable<DiagnosticInsight>> GetTelemetryInsightsAsync(string caseId);
    }
}
