using System.Threading.Channels;
using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightsUpdateService
    {
        Task<bool> NotifyInsightsUpdateAsync(string caseId, InsightsUpdateNotificationRequestDto request);
        ChannelReader<DiagnosticInsightEventDto> RegisterListener(string caseId);
    }
}
