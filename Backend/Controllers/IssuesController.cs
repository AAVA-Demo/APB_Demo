using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/issues")]
    [Authorize]
    public class IssuesController : ControllerBase
    {
        private readonly IIssueService _service;

        public IssuesController(IIssueService service)
        {
            _service = service;
        }

        [HttpGet("active")]
        [ProducesResponseType(typeof(IEnumerable<IssueDto>), 200)]
        public async Task<IActionResult> GetActiveIssues()
        {
            var issues = await _service.GetActiveIssuesAsync();
            return Ok(issues);
        }

        [HttpGet("{issueId}")]
        [ProducesResponseType(typeof(IssueDto), 200)]
        public async Task<IActionResult> GetIssue(string issueId)
        {
            var issue = await _service.GetIssueAsync(issueId);
            if (issue == null)
            {
                return NotFound();
            }

            return Ok(issue);
        }
    }
}
