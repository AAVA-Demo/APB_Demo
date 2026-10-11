using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Services
{
    public class DiagnosticPanelService : IDiagnosticPanelService
    {
        private readonly ICaseContextService _caseContextService;

        public DiagnosticPanelService(ICaseContextService caseContextService)
        {
            _caseContextService = caseContextService;
        }

        public async Task<DiagnosticPanelContextDto> GetPanelContextAsync(string workspaceId, string caseId)
        {
            var context = await _caseContextService.GetCaseContextAsync(workspaceId, caseId);
            if (context == null)
            {
                throw new CaseNotFoundException();
            }

            return new DiagnosticPanelContextDto
            {
                CaseId = context.CaseId,
                MemberId = context.MemberId,
                PanelEnabled = true,
                InsightsSummary = $"Status: {context.Status}"
            };
        }
    }
}
