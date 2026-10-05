using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/remediation")]
    [Authorize]
    public class RemediationGuidanceController : ControllerBase
    {
        private readonly IRemediationGuidanceService _service;

        public RemediationGuidanceController(IRemediationGuidanceService service)
        {
            _service = service;
        }

        [HttpGet("{caseId}")]
        public async Task<ActionResult<RemediationStepsResponseDto>> GetRemediationSteps(string caseId)
        {
            try
            {
                var result = await _service.GetRemediationStepsAsync(caseId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("/internal/remediation/build")]
        [AllowAnonymous]
        public async Task<ActionResult<RemediationStepsResponseDto>> BuildRemediationSteps([FromBody] RemediationStepsBuildRequestDto request)
        {
            try
            {
                var result = await _service.BuildRemediationStepsAsync(request.CaseId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
