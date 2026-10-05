using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/diagnostics")]
    [Authorize]
    public class RemediationStepTrackingController : ControllerBase
    {
        private readonly IRemediationStepTrackingService _service;

        public RemediationStepTrackingController(IRemediationStepTrackingService service)
        {
            _service = service;
        }

        [HttpGet("issues/{issueId}/remediation-steps")]
        public async Task<ActionResult<RemediationStepListResponse>> GetRemediationSteps(string issueId)
        {
            try
            {
                var result = await _service.GetRemediationStepsAsync(issueId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("issues/{issueId}/remediation-steps/{stepId}/complete")]
        public async Task<ActionResult<RemediationStepUpdateResponse>> CompleteRemediationStep(string issueId, string stepId, [FromBody] RemediationStepCompleteRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.CompleteRemediationStepAsync(issueId, stepId, request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
        }
    }
}
