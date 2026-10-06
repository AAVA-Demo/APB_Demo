using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/remediation/cases/{caseId}")]
    [Authorize]
    public class RemediationWorkflowController : ControllerBase
    {
        private readonly IRemediationWorkflowService _service;

        public RemediationWorkflowController(IRemediationWorkflowService service)
        {
            _service = service;
        }

        [HttpGet("workflow")]
        public async Task<ActionResult<RemediationWorkflowResponseDto>> GetRemediationWorkflowForCase(string caseId)
        {
            var result = await _service.GetWorkflow(caseId);
            return Ok(result);
        }

        [HttpPost("issues/{issueId}/start")]
        public async Task<ActionResult<RemediationWorkflowStartResponseDto>> StartRemediationWorkflowForIssue(string caseId, string issueId, [FromBody] StartRemediationWorkflowRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(caseId) || string.IsNullOrWhiteSpace(issueId) || request.CaseId != caseId || request.IssueId != issueId)
            {
                return BadRequest("CaseId is required and must be valid. IssueId is required and must be associated with the case.");
            }

            var result = await _service.StartWorkflow(caseId, issueId);
            return Ok(result);
        }

        [HttpPatch("workflow/steps/{stepInstanceId}")]
        public async Task<ActionResult<RemediationStepStatusDto>> UpdateRemediationStepStatus(string caseId, string stepInstanceId, [FromBody] UpdateRemediationStepStatusRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(stepInstanceId))
            {
                return BadRequest("StepInstanceId is required and must reference an existing step.");
            }

            var result = await _service.UpdateStepStatus(caseId, stepInstanceId, request.Status);
            return Ok(result);
        }

        [HttpGet("workflow/status")]
        public async Task<ActionResult<RemediationWorkflowStatusDto>> GetRemediationWorkflowStatusForCase(string caseId)
        {
            var result = await _service.GetWorkflowStatus(caseId);
            return Ok(result);
        }
    }
}
