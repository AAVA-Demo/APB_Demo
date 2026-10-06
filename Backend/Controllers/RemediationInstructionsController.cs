using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/remediation/issues/{issueId}/instructions")]
    [Authorize]
    public class RemediationInstructionsController : ControllerBase
    {
        private readonly IRemediationInstructionsService _service;

        public RemediationInstructionsController(IRemediationInstructionsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<RemediationInstructionsResponseDto>> GetRemediationInstructionsForIssue(string issueId)
        {
            var result = await _service.GetInstructions(issueId);
            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<RemediationInstructionsRefreshStatusDto>> RefreshRemediationInstructions(string issueId, [FromBody] RefreshRemediationInstructionsRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(issueId) || issueId != request.IssueId)
            {
                return BadRequest("IssueId is required and must reference an existing issue.");
            }

            var result = await _service.RefreshInstructions(issueId);
            return Ok(result);
        }
    }
}
