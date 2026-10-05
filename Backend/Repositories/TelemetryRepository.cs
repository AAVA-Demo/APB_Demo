using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Repositories
{
    public class TelemetryRepository : ITelemetryRepository
    {
        public Task<IEnumerable<DiagnosticInsight>> GetTelemetryInsightsAsync(string caseId)
        {
            var insights = new List<DiagnosticInsight>
            {
                new DiagnosticInsight { Key = "errorRate", Label = "Error Rate", Value = "2.5", Unit = "%" },
                new DiagnosticInsight { Key = "lastFailure", Label = "Last Failure", Value = "2024-01-01T00:00:00Z" }
            };
            return Task.FromResult<IEnumerable<DiagnosticInsight>>(insights);
        }
    }
}
