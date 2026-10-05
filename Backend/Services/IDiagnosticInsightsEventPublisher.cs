using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IDiagnosticInsightsEventPublisher
    {
        Task PublishInsightsUpdatedAsync(string caseId);
    }
}
