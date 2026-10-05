using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues/{issueId:guid}/workflow")]
    [Authorize]
    public class RemediationWorkflowController : ControllerBase
    {
        private readonly IRemediationWorkflowService _service;

        public RemediationWorkflowController(IRemediationWorkflowService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(WorkflowDto), 200)]
        public async Task<IActionResult> GetWorkflow(Guid issueId)
        {
            if (issueId == Guid.Empty)
            {
                return BadRequest("Invalid issueId.");
            }

            var workflow = await _service.GetWorkflowAsync(issueId);
            if (workflow == null)
            {
                return NotFound();
            }

            return Ok(workflow);
        }

        [HttpPost("steps/{stepId:guid}")]
        [ProducesResponseType(typeof(WorkflowDto), 200)]
        public async Task<IActionResult> CompleteStep(Guid issueId, Guid stepId, [FromBody] StepCompletionRequestDto request)
        {
            if (issueId == Guid.Empty || stepId == Guid.Empty || request == null || request.StepId == Guid.Empty || request.StepId != stepId)
            {
                return BadRequest("Invalid request.");
            }

            var result = await _service.CompleteStepAsync(issueId, stepId, request.IsCompleted);
            if (result == null)
            {
                return NotFound();
            }

            if (!result.IsOrderValid)
            {
                return Conflict("Step completion out of order.");
            }

            return Ok(result.Workflow);
        }
    }
}
