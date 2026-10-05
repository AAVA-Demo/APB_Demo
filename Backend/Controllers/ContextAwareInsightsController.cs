using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/support/members/{memberId}/context-insights")]
    [Authorize]
    public class ContextAwareInsightsController : ControllerBase
    {
        private readonly IContextAwareInsightsService _contextAwareInsightsService;

        public ContextAwareInsightsController(IContextAwareInsightsService contextAwareInsightsService)
        {
            _contextAwareInsightsService = contextAwareInsightsService;
        }

        [HttpGet]
        public async Task<ActionResult<ContextAwareInsightsResponseDto>> GetContextAwareInsights(string memberId, [FromQuery] string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("CaseId must be provided");
            }

            if (string.IsNullOrWhiteSpace(memberId))
            {
                return BadRequest("memberId is required");
            }

            var response = await _contextAwareInsightsService.GetContextAwareInsightsAsync(memberId, caseId);
            if (response == null)
            {
                return NotFound("Member not found");
            }

            return Ok(response);
        }
    }
}
