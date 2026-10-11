using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/workspace/{workspaceId}/cases/{caseId}/diagnostic-panel")]
    [Authorize]
    public class DiagnosticPanelController : ControllerBase
    {
        private readonly IDiagnosticPanelService _diagnosticPanelService;
        private readonly IWorkspaceIntegrationService _workspaceIntegrationService;

        public DiagnosticPanelController(IDiagnosticPanelService diagnosticPanelService, IWorkspaceIntegrationService workspaceIntegrationService)
        {
            _diagnosticPanelService = diagnosticPanelService;
            _workspaceIntegrationService = workspaceIntegrationService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(DiagnosticPanelContextDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetDiagnosticPanelContext(string workspaceId, string caseId)
        {
            if (string.IsNullOrWhiteSpace(workspaceId))
            {
                return BadRequest("WorkspaceId is required.");
            }

            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("CaseId is required.");
            }

            try
            {
                var enabled = await _workspaceIntegrationService.IsPanelEnabledAsync(workspaceId);
                if (!enabled)
                {
                    throw new DiagnosticPanelUnavailableException();
                }

                var context = await _diagnosticPanelService.GetPanelContextAsync(workspaceId, caseId);
                return Ok(context);
            }
            catch (WorkspaceNotFoundException)
            {
                return NotFound("Workspace not found.");
            }
            catch (CaseNotFoundException)
            {
                return NotFound("Case not found.");
            }
            catch (DiagnosticPanelUnavailableException)
            {
                return NotFound("Diagnostic panel is not available for this workspace.");
            }
        }
    }
}
