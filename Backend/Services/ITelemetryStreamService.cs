using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface ITelemetryStreamService
    {
        Task<TelemetryData?> GetLatestTelemetryAsync(string caseId);
    }
}
