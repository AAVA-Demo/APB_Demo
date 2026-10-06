using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostic-panel/remediation-guidance")]
    [Authorize]
    public class RemediationGuidanceController : ControllerBase
    {
        private readonly IRemediationGuidanceService _remediationGuidanceService;
        private readonly IAuthenticationContextProvider _authenticationContextProvider;

        public RemediationGuidanceController(IRemediationGuidanceService remediationGuidanceService, IAuthenticationContextProvider authenticationContextProvider)
        {
            _remediationGuidanceService = remediationGuidanceService;
            _authenticationContextProvider = authenticationContextProvider;
        }

        [HttpGet]
        public async Task<ActionResult<RemediationGuidanceDto>> GetRemediationGuidance([FromQuery] string memberIssueId)
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
                var dto = await _remediationGuidanceService.GetGuidance(memberIssueId, agentId);
                return Ok(dto);
            }
            catch (MemberIssueNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (RemediationGuidanceNotAvailableException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
