using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Dtos;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostic-panel/context-recommendations")]
    [Authorize]
    public class ContextRecommendationsController : ControllerBase
    {
        private readonly IContextAwareRecommendationService _contextAwareRecommendationService;
        private readonly IAuthenticationContextProvider _authenticationContextProvider;

        public ContextRecommendationsController(IContextAwareRecommendationService contextAwareRecommendationService, IAuthenticationContextProvider authenticationContextProvider)
        {
            _contextAwareRecommendationService = contextAwareRecommendationService;
            _authenticationContextProvider = authenticationContextProvider;
        }

        [HttpGet]
        public async Task<ActionResult<ContextRecommendationsDto>> GetContextAwareRecommendations([FromQuery] string memberIssueId)
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
                var dto = await _contextAwareRecommendationService.GetRecommendations(memberIssueId, agentId);
                return Ok(dto);
            }
            catch (MemberIssueNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (RecommendationsNotAvailableException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
