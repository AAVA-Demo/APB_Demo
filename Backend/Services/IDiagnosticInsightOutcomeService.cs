using System.Threading.Tasks;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IDiagnosticInsightOutcomeService
    {
        Task<DiagnosticOutcomeDto> RecordResolutionOutcome(
            string caseId,
            string insightId,
            bool isResolved,
            string comment,
            string recordedBy);
    }
}
