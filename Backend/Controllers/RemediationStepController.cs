using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/issues/{issueId}/remediation")]
    [Authorize]
    public class RemediationStepController : ControllerBase
    {
        private readonly IRemediationStepService _service;

        public RemediationStepController(IRemediationStepService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<RemediationStepsResponseDto> GetRemediationSteps(
            [FromRoute][Required] string caseId,
            [FromRoute][Required] string issueId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId must not be blank");
            }

            if (string.IsNullOrWhiteSpace(issueId))
            {
                return BadRequest("issueId must not be blank");
            }

            var response = _service.GetRemediationSteps(caseId, issueId);
            if (response == null || response.Steps.Count == 0)
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
