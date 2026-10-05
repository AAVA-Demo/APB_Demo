using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues/{issueId:guid}/guided-workflow")]
    [Authorize]
    public class GuidedResolutionController : ControllerBase
    {
        private readonly IGuidedResolutionService _service;

        public GuidedResolutionController(IGuidedResolutionService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GuidedResolutionWorkflowDto>> Get(Guid issueId)
        {
            var workflow = await _service.GetWorkflowAsync(issueId);
            if (workflow == null)
            {
                return NotFound(Problem("Guided workflow not found."));
            }

            return Ok(workflow);
        }

        [HttpPost("steps/status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GuidedResolutionWorkflowDto>> UpdateStepStatus(Guid issueId, [FromBody] GuidedResolutionStepStatusUpdateDto updateDto)
        {
            if (string.IsNullOrWhiteSpace(updateDto.StepId) || string.IsNullOrWhiteSpace(updateDto.NewStatus))
            {
                return BadRequest(Problem("Invalid step update payload."));
            }

            try
            {
                var workflow = await _service.UpdateStepStatusAsync(issueId, updateDto);
                return Ok(workflow);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(Problem(ex.Message));
            }
        }
    }
}
