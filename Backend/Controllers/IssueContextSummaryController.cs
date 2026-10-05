using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Dtos;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cases/{caseId}/issue-context-summary")]
    [Authorize]
    public class IssueContextSummaryController : ControllerBase
    {
        private readonly IIssueContextSummaryService _service;

        public IssueContextSummaryController(IIssueContextSummaryService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IssueContextSummaryResponseDto> GetIssueContextSummary([FromRoute][Required] string caseId)
        {
            if (string.IsNullOrWhiteSpace(caseId))
            {
                return BadRequest("caseId must not be blank");
            }

            var response = _service.GetSummary(caseId);
            if (response == null)
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
