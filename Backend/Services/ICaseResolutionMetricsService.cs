using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface ICaseResolutionMetricsService
    {
        Task<CaseResolutionMetricsResponseDto?> RecordMetricsAsync(string caseId, CaseResolutionMetricsRequestDto request);
        Task<CaseResolutionMetricsResponseDto?> GetMetricsAsync(string caseId);
    }
}
