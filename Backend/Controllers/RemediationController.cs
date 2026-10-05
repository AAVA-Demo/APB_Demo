using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/insights/{insightId:guid}/remediation")]
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
        public async Task<IActionResult> GetRemediationSteps(Guid insightId)
        {
            if (insightId == Guid.Empty)
            {
                return BadRequest("Invalid insightId.");
            }

            var steps = await _service.GetRemediationStepsAsync(insightId);
            if (!steps.Any())
            {
                return NotFound();
            }

            return Ok(steps);
        }
    }
}
