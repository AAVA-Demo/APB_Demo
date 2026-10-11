using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/remediation-steps")]
    [Authorize]
    public class RemediationStepsController : ControllerBase
    {
        private readonly IRemediationStepService _remediationStepService;

        public RemediationStepsController(IRemediationStepService remediationStepService)
        {
            _remediationStepService = remediationStepService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CaseRemediationStepsDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRemediationSteps(string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("CaseId is required.");
            }

            try
            {
                var result = await _remediationStepService.GetRemediationStepsAsync(caseId);
                return Ok(result);
            }
            catch (CaseNotFoundException)
            {
                return NotFound("No remediation steps available for this case.");
            }
            catch (IssuePatternNotRecognizedException)
            {
                return NotFound("No recognized issue pattern for this case.");
            }
        }
    }
}
