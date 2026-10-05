using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues/{issueId}/workflow")]
    [Authorize]
    public class WorkflowController : ControllerBase
    {
        private readonly IWorkflowService _service;

        public WorkflowController(IWorkflowService service)
        {
            _service = service;
        }

        [HttpGet]
        [ProducesResponseType(typeof(WorkflowDto), 200)]
        public async Task<IActionResult> GetWorkflow(string issueId)
        {
            var agentId = User.Identity?.Name ?? "agent";
            var workflow = await _service.GetWorkflowAsync(issueId, agentId);
            if (workflow == null)
            {
                return NotFound();
            }

            return Ok(workflow);
        }

        [HttpPost("steps/{stepId}/complete")]
        [ProducesResponseType(typeof(WorkflowDto), 200)]
        public async Task<IActionResult> CompleteStep(string issueId, Guid stepId, [FromBody] CompleteStepRequest request)
        {
            var agentId = User.Identity?.Name ?? "agent";
            var workflow = await _service.CompleteStepAsync(issueId, stepId, agentId, request);
            if (workflow == null)
            {
                return NotFound();
            }

            return Ok(workflow);
        }
    }
}
