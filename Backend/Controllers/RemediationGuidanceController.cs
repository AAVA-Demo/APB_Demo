using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/issues/{issueId}/remediation")]
    [Authorize]
    public class RemediationGuidanceController : ControllerBase
    {
        private readonly IRemediationGuidanceService _service;

        public RemediationGuidanceController(IRemediationGuidanceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetIssueRemediationSteps(string caseId, string issueId)
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

            try
            {
                var dto = await _service.GetIssueRemediationStepsAsync(caseId, issueId);
                return Ok(new ApiResponseWrapper<RemediationGuidanceDto>
                {
                    Status = "Success",
                    Data = dto,
                    ErrorMessage = null
                });
            }
            catch (CaseNotFoundException)
            {
                return NotFound(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Case not found.",
                    Data = null
                });
            }
            catch (IssueNotFoundException)
            {
                return NotFound(new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Issue not found.",
                    Data = null
                });
            }
            catch (RemediationGuidanceUnavailableException)
            {
                return StatusCode(503, new ApiResponseWrapper<string>
                {
                    Status = "Error",
                    ErrorMessage = "Unable to load remediation steps.",
                    Data = null
                });
            }
        }
    }
}
