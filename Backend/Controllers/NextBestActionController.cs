using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostic-panel/next-best-action")]
    [Authorize]
    public class NextBestActionController : ControllerBase
    {
        private readonly INextBestActionService _nextBestActionService;
        private readonly IAuthenticationContextProvider _authenticationContextProvider;

        public NextBestActionController(INextBestActionService nextBestActionService, IAuthenticationContextProvider authenticationContextProvider)
        {
            _nextBestActionService = nextBestActionService;
            _authenticationContextProvider = authenticationContextProvider;
        }

        [HttpGet]
        public async Task<ActionResult<NextBestActionPromptDto>> GetNextBestActionPrompt([FromQuery] string memberIssueId)
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
                var dto = await _nextBestActionService.GetPrompt(memberIssueId, agentId);
                return Ok(dto);
            }
            catch (MemberIssueNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (RecommendationNotAvailableException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
