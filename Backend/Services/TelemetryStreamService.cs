using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class TelemetryStreamService : ITelemetryStreamService
    {
        private readonly AppDbContext _dbContext;

        public TelemetryStreamService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TelemetryData?> GetLatestTelemetryAsync(string caseId)
        {
            var @case = await _dbContext.Cases.FirstOrDefaultAsync(c => c.CaseId == caseId);
            if (@case == null)
            {
                throw new CaseNotFoundException();
            }

            return new TelemetryData
            {
                CaseId = caseId,
                MetricsJson = "cpu:70;memory:65"
            };
        }
    }
}
