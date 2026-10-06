using System;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IResolutionMetricsService
    {
        Task<AiAssistedResolutionMetricsDto> GetAiAssistedMetrics(DateTime fromDate, DateTime toDate, string teamLeadId);
    }
}
