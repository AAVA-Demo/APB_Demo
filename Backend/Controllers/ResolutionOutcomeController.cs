using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues/{issueId}/resolution-outcome")]
    [Authorize]
    public class ResolutionOutcomeController : ControllerBase
    {
        private readonly IResolutionOutcomeService _service;

        public ResolutionOutcomeController(IResolutionOutcomeService service)
        {
            _service = service;
        }

        [HttpPost]
        [ProducesResponseType(typeof(ResolutionOutcomeDto), 201)]
        public async Task<IActionResult> CreateOutcome(string issueId, [FromBody] CreateResolutionOutcomeRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var agentId = User.Identity?.Name ?? "agent";
            var dto = await _service.CreateOutcomeAsync(issueId, agentId, request);
            return StatusCode(201, dto);
        }

        [HttpGet]
        [ProducesResponseType(typeof(ResolutionOutcomeDto), 200)]
        public async Task<IActionResult> GetOutcome(string issueId)
        {
            var dto = await _service.GetOutcomeAsync(issueId);
            if (dto == null)
            {
                return NotFound();
            }

            return Ok(dto);
        }

        [HttpPut]
        [ProducesResponseType(typeof(ResolutionOutcomeDto), 200)]
        public async Task<IActionResult> UpdateOutcome(string issueId, [FromBody] CreateResolutionOutcomeRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var agentId = User.Identity?.Name ?? "agent";
            var dto = await _service.UpdateOutcomeAsync(issueId, agentId, request);
            if (dto == null)
            {
                return NotFound();
            }

            return Ok(dto);
        }
    }
}
