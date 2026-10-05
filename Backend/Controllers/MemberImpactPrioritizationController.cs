using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics")]
    [Authorize]
    public class MemberImpactPrioritizationController : ControllerBase
    {
        private readonly IMemberImpactPrioritizationService _service;

        public MemberImpactPrioritizationController(IMemberImpactPrioritizationService service)
        {
            _service = service;
        }

        [HttpGet("members/{memberId}/issues")]
        public async Task<ActionResult<MemberImpactIssuesResponse>> GetPrioritizedIssues(string memberId)
        {
            try
            {
                var result = await _service.GetPrioritizedIssuesAsync(memberId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("members/{memberId}/recommendations")]
        public async Task<ActionResult<MemberImpactRecommendationsResponse>> GetPrioritizedRecommendations(string memberId)
        {
            try
            {
                var result = await _service.GetPrioritizedRecommendationsAsync(memberId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
