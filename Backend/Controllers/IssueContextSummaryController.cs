using System;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issue-context")]
    [Authorize]
    public class IssueContextSummaryController : ControllerBase
    {
        private readonly IIssueContextSummaryService _service;

        public IssueContextSummaryController(IIssueContextSummaryService service)
        {
            _service = service;
        }

        [HttpGet("{caseId}")]
        public async Task<ActionResult<IssueContextSummaryDto>> GetIssueContextSummary(string caseId, [FromQuery] string memberId)
        {
            try
            {
                var result = await _service.GetIssueContextSummaryAsync(caseId, memberId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("/internal/issue-context/build")]
        [AllowAnonymous]
        public async Task<ActionResult<IssueContextSummaryDto>> BuildIssueContextSummary([FromBody] IssueContextSummaryBuildRequestDto request)
        {
            try
            {
                var result = await _service.BuildIssueContextSummaryAsync(request.CaseId, request.MemberId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
