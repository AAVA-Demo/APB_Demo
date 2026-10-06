using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/issues")]
    [Authorize]
    public class IssueSeverityController : ControllerBase
    {
        private readonly IIssueSeverityService _service;

        public IssueSeverityController(IIssueSeverityService service)
        {
            _service = service;
        }

        [HttpGet("severity")]
        public async Task<IActionResult> GetCaseIssuesWithSeverity(string caseId)
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

            try
            {
                var dto = await _service.GetCaseIssuesWithSeverityAsync(caseId);
                return Ok(new ApiResponseWrapper<CaseIssueListDto>
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
            catch (IssuesNotFoundException)
            {
                return Ok(new ApiResponseWrapper<CaseIssueListDto>
                {
                    Status = "Success",
                    Data = new CaseIssueListDto { CaseId = caseId, Issues = new System.Collections.Generic.List<IssueSeverityDto>() },
                    ErrorMessage = null
                });
            }
        }
    }
}
