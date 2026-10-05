using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/members/{memberId:guid}/remediation-steps")]
    [Authorize]
    public class RemediationController : ControllerBase
    {
        private readonly IRemediationService _service;

        public RemediationController(IRemediationService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RemediationStepDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<RemediationStepDto>>> GetRemediationSteps(Guid memberId)
        {
            if (memberId == Guid.Empty)
            {
                return BadRequest();
            }

            var steps = await _service.GetRemediationStepsAsync(memberId);
            if (steps.Count == 0)
            {
                return NotFound();
            }

            return Ok(steps);
        }

        [HttpPatch("{stepId:guid}")]
        [ProducesResponseType(typeof(RemediationStepDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<RemediationStepDto>> UpdateRemediationStepStatus(Guid memberId, Guid stepId, [FromBody] UpdateRemediationStepStatusRequest request)
        {
            if (memberId == Guid.Empty || stepId == Guid.Empty)
            {
                return BadRequest();
            }

            var updated = await _service.UpdateRemediationStepStatusAsync(memberId, stepId, request);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }
    }
}
