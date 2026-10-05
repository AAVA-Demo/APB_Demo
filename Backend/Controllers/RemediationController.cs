using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues/{issueId}/remediation-steps")]
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
        public async Task<IActionResult> GetRemediationSteps(string issueId)
        {
            var steps = await _service.GetRemediationStepsAsync(issueId);
            return Ok(steps);
        }
    }
}
