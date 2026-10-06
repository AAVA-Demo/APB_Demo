using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/issues/{issueId}/remediation/steps")]
    [Authorize]
    public class RemediationStepTrackingController : ControllerBase
    {
        private readonly IRemediationStepTrackingService _service;

        public RemediationStepTrackingController(IRemediationStepTrackingService service)
        {
            _service = service;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetRemediationStepStatus(string caseId, string issueId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Invalid case identifier.",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(issueId))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Invalid issue identifier.",
                    Data = null
                });
            }

            var dto = await _service.GetRemediationStepStatusAsync(caseId, issueId);
            return Ok(new ApiResponseWrapper<RemediationStepStatusListDto>
            {
                Status = "Success",
                Data = dto,
                ErrorMessage = null
            });
        }

        [HttpPost("{stepId}/complete")]
        public async Task<IActionResult> MarkRemediationStepCompleted(string caseId, string issueId, string stepId, [FromBody] MarkStepCompletedRequest request)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Invalid case identifier.",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(issueId))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Invalid issue identifier.",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(stepId))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Invalid step identifier.",
                    Data = null
                });
            }

            if (request == null || string.IsNullOrWhiteSpace(request.CompletedBy))
            {
                return BadRequest(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "CompletedBy is required.",
                    Data = null
                });
            }

            try
            {
                var dto = await _service.MarkRemediationStepCompletedAsync(caseId, issueId, stepId, request.CompletedBy);
                return Ok(new ApiResponseWrapper<RemediationStepStatusDto>
                {
                    Status = "Success",
                    Data = dto,
                    ErrorMessage = null
                });
            }
            catch (StepNotFoundException)
            {
                return NotFound(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Step not found.",
                    Data = null
                });
            }
        }
    }
}
