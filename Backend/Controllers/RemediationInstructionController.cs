using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/support/cases/{caseId}/remediation")]
    [Authorize]
    public class RemediationInstructionController : ControllerBase
    {
        private readonly IRemediationInstructionService _remediationInstructionService;

        public RemediationInstructionController(IRemediationInstructionService remediationInstructionService)
        {
            _remediationInstructionService = remediationInstructionService;
        }

        [HttpGet]
        public async Task<ActionResult<RemediationInstructionResponseDto>> GetRemediationInstructions(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId is required");
            }

            var response = await _remediationInstructionService.GetRemediationInstructionsAsync(caseId);
            if (response == null)
            {
                return NotFound("Case not found");
            }

            return Ok(response);
        }
    }
}
