using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public interface IInsightRepository
    {
        Task<List<Insight>> GetInsightsAsync(string caseId);
        Task<List<Insight>> GetRemediationsAsync(string caseId);
    }
}
