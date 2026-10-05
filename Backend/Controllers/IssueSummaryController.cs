using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics")]
    [Authorize]
    public class IssueSummaryController : ControllerBase
    {
        private readonly IIssueSummaryService _service;

        public IssueSummaryController(IIssueSummaryService service)
        {
            _service = service;
        }

        [HttpGet("members/{memberId}/issues/{issueId}/summary")]
        public async Task<ActionResult<IssueSummaryResponse>> GetIssueSummary(string memberId, string issueId)
        {
            try
            {
                var result = await _service.GetIssueSummaryAsync(memberId, issueId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
