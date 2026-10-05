using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues/{issueId:guid}/remediation-steps")]
    [Authorize]
    public class RemediationStepsController : ControllerBase
    {
        private readonly IRemediationStepsService _service;

        public RemediationStepsController(IRemediationStepsService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<RemediationStepDto>>> Get(Guid issueId)
        {
            if (issueId == Guid.Empty)
            {
                return BadRequest(Problem("Invalid issueId."));
            }

            var steps = await _service.GetRemediationStepsAsync(issueId);
            if (steps.Count == 0)
            {
                return NotFound(Problem("No remediation steps found."));
            }

            return Ok(steps);
        }
    }
}
