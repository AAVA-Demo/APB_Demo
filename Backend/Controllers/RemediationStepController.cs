using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics")]
    [Authorize]
    public class RemediationStepController : ControllerBase
    {
        private readonly IRemediationStepService _service;

        public RemediationStepController(IRemediationStepService service)
        {
            _service = service;
        }

        [HttpGet("members/{memberId}/issues/{issueId}/steps")]
        public async Task<ActionResult<RemediationStepResponse>> GetRemediationSteps(string memberId, string issueId)
        {
            try
            {
                var result = await _service.GetRemediationStepsAsync(memberId, issueId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
