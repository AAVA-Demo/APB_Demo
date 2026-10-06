using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostic-panel/diagnostic-insights")]
    [Authorize]
    public class DiagnosticInsightsController : ControllerBase
    {
        private readonly IDiagnosticInsightsService _diagnosticInsightsService;
        private readonly IAuthenticationContextProvider _authenticationContextProvider;

        public DiagnosticInsightsController(IDiagnosticInsightsService diagnosticInsightsService, IAuthenticationContextProvider authenticationContextProvider)
        {
            _diagnosticInsightsService = diagnosticInsightsService;
            _authenticationContextProvider = authenticationContextProvider;
        }

        [HttpGet]
        public async Task<ActionResult<DiagnosticInsightsDto>> GetRealTimeDiagnosticInsights([FromQuery] string memberIssueId)
        {
            if (string.IsNullOrWhiteSpace(memberIssueId))
            {
                return BadRequest("Member issue identifier is required.");
            }

            var agentId = _authenticationContextProvider.GetCurrentUserId();
            if (string.IsNullOrWhiteSpace(agentId))
            {
                return Unauthorized("Authenticated agent is required.");
            }

            try
            {
                var dto = await _diagnosticInsightsService.GetInsights(memberIssueId, agentId);
                return Ok(dto);
            }
            catch (MemberIssueNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (DiagnosticInsightsNotAvailableException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
